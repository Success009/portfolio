// Track active listeners
    const activeCommentRefs = {}; 

    window.toggleComments = (key) => {
        const sec = document.getElementById(`comments-${key}`);
        if(sec.classList.contains('show')) {
            sec.classList.remove('show');
            // Optional: stop listening when closed to save resources
            if (activeCommentRefs[key]) {
                activeCommentRefs[key].off();
                delete activeCommentRefs[key];
            }
        } else {
            sec.classList.add('show');
            loadComments(key);
        }
    };

    window.loadComments = (key) => {
        const list = document.getElementById(`list-${key}`);
        if(!list) return;

        // Clean up any existing listener for this announcement
        if (activeCommentRefs[key]) activeCommentRefs[key].off();

        const ref = db.ref(`Ability/announcements/${key}/comments`);
        activeCommentRefs[key] = ref;

        ref.on('value', snap => {
            // ALWAYS re-fetch the list element because main.js re-renders the whole announcement card frequently
            const currentList = document.getElementById(`list-${key}`);
            if(!currentList) return;
            
            currentList.innerHTML = '';
            const countSpan = document.getElementById(`count-${key}`);
            
            if(snap.exists()) {
                let totalCount = 0;
                const parents = [];
                
                snap.forEach(c => {
                    const val = c.val();
                    const replies = [];
                    if(val.replies) {
                        Object.entries(val.replies).forEach(([rKey, rVal]) => {
                            replies.push({key: rKey, ...rVal});
                            totalCount++;
                        });
                        replies.sort((a,b) => a.timestamp - b.timestamp);
                    }
                    parents.push({key: c.key, ...val, repliesList: replies});
                    totalCount++;
                });
                
                if (countSpan) countSpan.innerText = totalCount;
                parents.sort((a, b) => a.timestamp - b.timestamp);

                parents.forEach(p => {
                    const div = document.createElement('div'); 
                    div.className = 'comment-wrapper';
                    const isOwner = p.uid === currentUserUID;
                    const editedTag = p.edited ? '<small style="opacity:0.5;margin-left:5px;">(edited)</small>' : '';
                    
                    div.innerHTML = `
                        <div class="comment-item">
                            <div class="comment-user">${escapeHtml(p.ign)}${editedTag}</div>
                            <div class="comment-text" id="text-${p.key}">${escapeHtml(p.text)}</div>
                            <div class="comment-actions">
                                <span onclick="showReplyInput('${key}', '${p.key}')"><i class="fa-solid fa-reply"></i> Reply</span>
                                ${isOwner ? `<span onclick="showEditInput('${key}', '${p.key}')"><i class="fa-solid fa-pen"></i> Edit</span>` : ''}
                                ${isOwner ? `<span onclick="deleteComment('${key}', '${p.key}')" style="color:var(--danger)"><i class="fa-solid fa-trash"></i> Delete</span>` : ''}
                            </div>
                        </div>
                        <div class="replies-list" id="replies-list-${p.key}"></div>
                        <div id="reply-input-cont-${p.key}" class="reply-input-box" style="display:none; margin-left:30px;"></div>
                    `;
                    currentList.appendChild(div);

                    const rList = div.querySelector(`.replies-list`);
                    p.repliesList.forEach(r => {
                        const rIsOwner = r.uid === currentUserUID;
                        const rEdited = r.edited ? '<small style="opacity:0.5;margin-left:5px;">(edited)</small>' : '';
                        const rDiv = document.createElement('div');
                        rDiv.className = 'comment-item reply-item';
                        rDiv.innerHTML = `
                            <div class="comment-user">${escapeHtml(r.ign)}${rEdited}</div>
                            <div class="comment-text" id="text-${r.key}">${escapeHtml(r.text)}</div>
                            <div class="comment-actions">
                                ${rIsOwner ? `<span onclick="showEditInput('${key}', '${r.key}', '${p.key}')"><i class="fa-solid fa-pen"></i> Edit</span>` : ''}
                                ${rIsOwner ? `<span onclick="deleteComment('${key}', '${r.key}', '${p.key}')" style="color:var(--danger)"><i class="fa-solid fa-trash"></i> Delete</span>` : ''}
                            </div>
                        `;
                        rList.appendChild(rDiv);
                    });
                });
            } else { 
                if (countSpan) countSpan.innerText = '0';
                currentList.innerHTML = '<div style="color:#aaa; text-align:center; padding:10px;">No comments yet.</div>'; 
            }
        });
    };

    const showConfirm = (message, onProceed) => {
        const modal = document.getElementById('confirmModal');
        const msgEl = document.getElementById('confirmMessage');
        const proceedBtn = document.getElementById('confirmProceed');
        const cancelBtn = document.getElementById('confirmCancel');

        msgEl.innerText = message;
        modal.classList.add('show');

        const close = () => modal.classList.remove('show');
        
        proceedBtn.onclick = () => { onProceed(); close(); };
        cancelBtn.onclick = close;
        // Also close if clicking outside
        modal.onclick = (e) => { if(e.target === modal) close(); };
    };

    window.deleteComment = (annKey, commentKey, parentKey = null) => {
        const proceedDeletion = () => {
            let path = `Ability/announcements/${annKey}/comments/${commentKey}`;
            if(parentKey) path = `Ability/announcements/${annKey}/comments/${parentKey}/replies/${commentKey}`;
            db.ref(path).remove();
        };

        if (parentKey) {
            // It's a reply
            showConfirm("Are you sure you want to delete this reply?", proceedDeletion);
        } else {
            // It's a parent comment - check for replies
            db.ref(`Ability/announcements/${annKey}/comments/${commentKey}/replies`).once('value', snap => {
                const replyCount = snap.numChildren();
                let message = "Are you sure you want to delete this comment?";
                if (replyCount > 0) {
                    message = `This will also delete ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}. Are you sure?`;
                }
                showConfirm(message, proceedDeletion);
            });
        }
    };

    window.showReplyInput = (annKey, parentKey) => {
        if(!currentUserIGN) return showLoginModal();
        const cont = document.getElementById(`reply-input-cont-${parentKey}`);
        cont.style.display = 'flex';
        cont.innerHTML = `
            <input type="text" id="input-reply-${parentKey}" class="comment-input" placeholder="Write a reply..." onkeypress="if(event.key==='Enter') postComment('${annKey}', '${parentKey}')">
            <button class="comment-btn" onclick="postComment('${annKey}', '${parentKey}')"><i class="fas fa-paper-plane"></i></button>
        `;
        cont.querySelector('input').focus();
    };

    window.showEditInput = (annKey, commentKey, parentKey = null) => {
        const textEl = document.getElementById(`text-${commentKey}`);
        const originalText = textEl.innerText;
        const parent = textEl.parentElement;
        
        parent.innerHTML = `
            <input type="text" id="edit-${commentKey}" class="comment-input" value="${escapeHtml(originalText)}" style="width:100%; margin-bottom:5px;">
            <div style="display:flex; gap:10px;">
                <button class="btn-tiny" onclick="saveEdit('${annKey}', '${commentKey}', ${parentKey ? `'${parentKey}'` : 'null'})">Save</button>
                <button class="btn-tiny" onclick="loadComments('${annKey}')">Cancel</button>
            </div>
        `;
        document.getElementById(`edit-${commentKey}`).focus();
    };

    window.saveEdit = (annKey, commentKey, parentKey = null) => {
        const newText = document.getElementById(`edit-${commentKey}`).value.trim();
        if(!newText) return;
        
        let path = `Ability/announcements/${annKey}/comments/${commentKey}`;
        if(parentKey) path = `Ability/announcements/${annKey}/comments/${parentKey}/replies/${commentKey}`;
        
        db.ref(path).update({
            text: newText,
            edited: true,
            editTimestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => loadComments(annKey));
    };

    window.postComment = (key, parentKey = null) => {
        if(!currentUserIGN) return showLoginModal();
        const inputId = parentKey ? `input-reply-${parentKey}` : `input-${key}`;
        const input = document.getElementById(inputId);
        const text = input.value.trim();
        if(!text) return;
        
        const data = {
            ign: currentUserIGN, uid: currentUserUID, text: text, 
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        let path = `Ability/announcements/${key}/comments`;
        if(parentKey) path += `/${parentKey}/replies`;

        db.ref(path).push(data);
        input.value = '';
        if(parentKey) document.getElementById(`reply-input-cont-${parentKey}`).style.display = 'none';
    };