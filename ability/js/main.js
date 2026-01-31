    const firebaseConfig = {
        apiKey: "AIzaSyA6sANvYoAkXHYG8MjbZl6Pyq23CNdBuzA", authDomain: "community-canvas-255fa.firebaseapp.com",
        databaseURL: "https://community-canvas-255fa-default-rtdb.firebaseio.com", projectId: "community-canvas-255fa",
        storageBucket: "community-canvas-255fa.appspot.com", messagingSenderId: "729445267995", appId: "1:729445267995:web:05da6756d66c58b9ccd6be"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const auth = firebase.auth();
    const abilityRef = db.ref('Ability');

    // --- AUTH & LINKING ---
    let currentUserIGN = null, currentUserUID = null;
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUserUID = user.uid;
            db.ref(`Ability/security/users/${user.uid}`).on('value', snap => {
                const nameInput = document.getElementById('web-username');
                const linkBtn = document.getElementById('link-account-btn');
                if (snap.exists()) {
                    currentUserIGN = snap.val().ign;
                    nameInput.value = currentUserIGN;
                    nameInput.style.color = "var(--primary)";
                    linkBtn.innerText = "Linked ✓"; linkBtn.classList.add("linked"); linkBtn.onclick = null;
                } else {
                    currentUserIGN = null;
                    nameInput.value = "Anonymous";
                    nameInput.style.color = "#aaa";
                    linkBtn.innerText = "Link Account"; linkBtn.classList.remove("linked"); linkBtn.onclick = openLinkModal;
                }
                nameInput.disabled = true;
            });
        } else { auth.signInAnonymously().catch(console.error); }
    });

    function openLinkModal() { document.getElementById('linkModal').classList.add('show'); }
    function closeLinkModal() { document.getElementById('linkModal').classList.remove('show'); }
    function submitLinkCode() {
        const code = document.getElementById('link-code-input').value.trim();
        const status = document.getElementById('link-status');
        if (code.length !== 6) { status.innerText = "Invalid length."; status.style.color = "var(--danger)"; return; }
        status.innerText = "Verifying..."; status.style.color = "#aaa";
        db.ref(`Ability/security/link_requests/${currentUserUID}`).set(code)
            .then(() => { status.innerText = "Sent! Check game."; status.style.color = "var(--primary)"; setTimeout(closeLinkModal, 2000); })
            .catch(e => { status.innerText = "Error: " + e.message; status.style.color = "var(--danger)"; });
    }

    // --- BRIDGE LOGIC ---
    const MC_PATHS = { root: 'Ability/minecraft', status: 'status', chat: 'chatLogs', players: 'onlinePlayers' };
    const mcRef = db.ref(MC_PATHS.root);

    function initServerMonitor() {
        mcRef.child(MC_PATHS.status).on('value', snapshot => {
            const data = snapshot.val();
            const container = document.getElementById('status-container');
            const label = document.getElementById('status-text-label');
            const badges = document.getElementById('stat-badges');
            const now = Date.now();
            const lastUpdate = data ? (data.timestamp || 0) : 0;
            const isOnline = data && data.online && (now - lastUpdate < 45000);

            if (isOnline) {
                container.className = 'status-dot-container online';
                label.innerText = "ONLINE"; label.style.color = "var(--primary)";
                badges.style.opacity = "1";
                document.getElementById('stat-players').innerText = `${data.onlinePlayers || 0}/${data.maxPlayers || 0}`;
                document.getElementById('stat-tps').innerText = data.tps || "20.0";
                const tpsBadge = document.getElementById('badge-tps');
                const tps = parseFloat(data.tps);
                if (tps >= 18) tpsBadge.className = 'badge tps-high';
                else if (tps >= 15) tpsBadge.className = 'badge tps-med';
                else tpsBadge.className = 'badge tps-low';
            } else {
                container.className = 'status-dot-container offline';
                label.innerText = "OFFLINE"; label.style.color = "var(--danger)";
                badges.style.opacity = "0";
                document.getElementById('player-count-badge').innerText = "0";
                document.getElementById('player-list-container').innerHTML = '<div style="text-align: center; padding: 20px; color: #aaa;">Offline</div>';
            }
        });
    }

    function initPlayerList() {
        mcRef.child(MC_PATHS.players).on('value', snapshot => {
            const data = snapshot.val();
            const container = document.getElementById('player-list-container');
            if (!data) return;
            const players = [];
            Object.keys(data).forEach(key => { if (key !== 'count' && key !== 'timestamp') players.push({ uuid: key, ...data[key] }); });
            document.getElementById('player-count-badge').innerText = players.length;
            container.innerHTML = '';
            if (players.length === 0) { container.innerHTML = '<div style="text-align: center; padding: 20px; color: #aaa;">None online</div>'; return; }
            players.forEach(p => {
                const row = document.createElement('div'); row.className = 'player-item';
                row.innerHTML = `<img src="https://crafatar.com/avatars/${p.uuid}?size=32&overlay" class="player-head" onerror="this.src='https://crafatar.com/avatars/Steve?size=32'"><div class="player-name" style="color:${p.op ? '#e74c3c' : 'white'}">${p.name}</div>`;
                container.appendChild(row);
            });
        });
    }

    function initChat() {
        const container = document.getElementById('chat-messages');
        mcRef.child(MC_PATHS.chat).limitToLast(50).on('child_added', snapshot => {
            const msg = snapshot.val(); if (!msg) return;
            if (container.children.length > 0 && container.children[0].innerText.includes('Connecting')) container.innerHTML = '';
            const div = document.createElement('div'); div.className = 'chat-msg';
            const safeUser = escapeHtml(msg.player || 'Unknown');
            const safeMsg = escapeHtml(msg.message || '');
            let userColor = msg.source === 'WEB' ? '#3498db' : '#2ecc71';
            if (msg.player === 'Admin') userColor = '#e74c3c';

            if (msg.source === 'WEB') div.innerHTML = `<span class="tag web">WEB</span> <span class="msg-user" style="color:${userColor}; font-weight:bold;">${safeUser}</span> <span class="msg-content">${safeMsg}</span>`;
            else div.innerHTML = `<span class="tag game">GAME</span> <span class="msg-user" style="color:${userColor}; font-weight:bold;">${safeUser}</span> <span class="msg-content">${safeMsg}</span>`;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        });
    }

    window.sendToMinecraft = function() {
        const msgIn = document.getElementById('web-message');
        const msg = msgIn.value.trim();
        if (!msg) return;
        mcRef.child(MC_PATHS.chat).push({ player: currentUserIGN || "Anonymous", message: msg, source: "WEB", timestamp: firebase.database.ServerValue.TIMESTAMP })
            .catch(error => alert("Error: " + error.message));
        msgIn.value = '';
    };

    function escapeHtml(text) { return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ''; }

    // --- GENERIC CONTENT ---
    let userIP = null;
    async function fetchUserIP() {
        try { const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); userIP = d.ip.replace(/\./g, '-').replace(/:/g, '_'); }
        catch { if(!localStorage.getItem('fallback_uid')) localStorage.setItem('fallback_uid', 'user_'+Math.random().toString(36).substr(2,9)); userIP = localStorage.getItem('fallback_uid'); }
    }
    fetchUserIP();

    const handleVote = (key, type) => {
        if (!currentUserIGN) return showLoginModal();
        db.ref(`Ability/announcements/${key}/votes/${currentUserUID}`).transaction(cur => cur === type ? null : type);
    };

    const modal = document.getElementById('abilityModal');
    const linkModal = document.getElementById('linkModal');
    const loginModal = document.getElementById('login-modal');
    
    // Shared closing logic
    document.querySelectorAll('.close').forEach(btn => {
        btn.onclick = () => { modal.classList.remove('show'); linkModal.classList.remove('show'); loginModal.classList.remove('show'); };
    });
    window.onclick = (e) => { 
        if (e.target == modal) modal.classList.remove('show'); 
        if (e.target == linkModal) linkModal.classList.remove('show'); 
        if (e.target == loginModal) loginModal.classList.remove('show');
    };

    window.showLoginModal = () => loginModal.classList.add('show');

    function getYoutubeId(url) {
        if(!url) return null;
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function openDynamicModal(item) {
        document.getElementById('modalTitle').textContent = item.name;
        document.getElementById('modalTitle').style.color = item.color || 'var(--primary)';
        document.getElementById('modalType').textContent = item.rarity ? `${item.type} - ${item.rarity}` : item.type;
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = '';
        if (item.videoUrl) {
            const ytid = getYoutubeId(item.videoUrl);
            if (ytid) modalBody.innerHTML += `<div class="video-container"><iframe src="https://www.youtube.com/embed/${ytid}" frameborder="0" allowfullscreen></iframe></div>`;
        }
        const ignored = ['name', 'color', 'type', 'rarity', 'id', 'order', 'key', 'votes', 'videoUrl'];
        const formatTitle = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        for (const k in item) {
            if (!ignored.includes(k) && item.hasOwnProperty(k)) {
                let html = '';
                if (typeof item[k] === 'string' && item[k].trim()) html = `<p>${item[k]}</p>`;
                else if (Array.isArray(item[k]) && item[k].length) html = `<ul>${item[k].map(i => `<li>${i}</li>`).join('')}</ul>`;
                if(html) modalBody.innerHTML += `<div class="modal-section"><h3 class="modal-section-title">${formatTitle(k)}</h3>${html}</div>`;
            }
        }
        modal.classList.add('show');
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1 });

    const loadData = (node, contId, renderFn, rev=false) => {
        abilityRef.child(node).orderByChild(node==='announcements'?'timestamp':'id').on('value', snap => {
            const cont = document.getElementById(contId);
            cont.innerHTML = '';
            if(!snap.exists()) { cont.innerHTML = '<p style="text-align:center">Empty.</p>'; return; }
            const items = [];
            snap.forEach(c => { const v = c.val(); if(node==='announcements' && v.status==='draft') return; items.push({key: c.key, ...v}); });
            if(rev) items.reverse();
            items.forEach((item, i) => {
                const el = renderFn(item);
                el.classList.add('animate-on-scroll');
                el.style.setProperty('--animation-delay', `${i*50}ms`);
                cont.appendChild(el);
                observer.observe(el);
            });
        });
    };

    const renderAbil = (d) => {
        const div = document.createElement('div'); div.className = 'ability-card interactive-card'; div.onclick = () => openDynamicModal(d);
        div.innerHTML = `<div class="ability-header"><h3 class="ability-title"><span style="color: ${d.color}">${d.name}</span><span class="ability-type">${d.type}</span></h3></div><div class="ability-body"><p class="ability-description">${d.description}</p></div>`;
        return div;
    };
    const renderSub = (d) => {
        const div = document.createElement('div'); div.className = 'ability-card interactive-card'; div.onclick = () => openDynamicModal(d);
        div.innerHTML = `<div class="ability-header"><h3 class="ability-title"><span style="color: ${d.color}">${d.name}</span><span class="ability-type">${d.type}</span></h3></div><div class="ability-body"><p><strong>Rarity:</strong> ${d.rarity}</p><p class="ability-description">${d.description}</p></div>`;
        return div;
    };
    const renderRule = (d) => {
        const li = document.createElement('li'); li.className = 'rule-item interactive-card';
        li.innerHTML = `<h3 class="rule-title">${d.title}</h3><p>${d.description}</p>`;
        return li;
    };
    const renderAnn = (d) => {
        const div = document.createElement('div'); div.className = 'announcement-card interactive-card';
        let l=0, dl=0, uv=null;
        if(d.votes) Object.entries(d.votes).forEach(([ip, v]) => { if(v==='like') l++; if(v==='dislike') dl++; if(ip===currentUserUID) uv=v; });
        
        const totalComments = getTotalCommentCount(d.comments);
        
        div.innerHTML = `<h3 class="announcement-title">${d.title}</h3><div class="announcement-date">Posted on ${new Date(d.timestamp).toLocaleDateString()}</div><div class="announcement-content">${d.content}</div><div class="announcement-footer"><button class="vote-btn ${uv==='like'?'active':''}" onclick="handleVote('${d.key}','like')"><i class="fa-solid fa-thumbs-up"></i> ${l}</button><button class="vote-btn dislike ${uv==='dislike'?'active':''}" onclick="handleVote('${d.key}','dislike')"><i class="fa-solid fa-thumbs-down"></i> ${dl}</button><button class="vote-btn" onclick="toggleComments('${d.key}')" style="margin-left:auto;"><i class="fa-solid fa-comments"></i> <span id="count-${d.key}">${totalComments}</span> Comments</button></div>
        <div id="comments-${d.key}" class="comments-section"><div id="list-${d.key}" class="comment-list"></div><div class="comment-input-area"><input type="text" id="input-${d.key}" class="comment-input" placeholder="Write a comment..." onkeypress="if(event.key==='Enter') postComment('${d.key}')"><button class="comment-btn" onclick="postComment('${d.key}')"><i class="fas fa-paper-plane"></i></button></div></div>`;
        return div;
    };

    function createMinecraftBlocks() {
      const container = document.getElementById('minecraft-blocks');
      if (!container) return;
      container.innerHTML = '';
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'block';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * -30;
        particle.style.animation = `ambient-float ${duration}s linear infinite`;
        particle.style.animationDelay = delay + 's';
        
        // Randomize color slightly between white and light green
        if (Math.random() > 0.5) {
          particle.style.background = '#2ecc71';
          particle.style.boxShadow = '0 0 10px #2ecc71';
        }
        
        container.appendChild(particle);
      }
    }

    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('selected'));
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active', 'fade-out'));
        tab.classList.add('selected');
        const target = document.getElementById(`${tab.dataset.tab}-section`);
        if(tab.dataset.tab === 'announcement') {
            tab.classList.remove('has-new-content'); document.getElementById('mobile-notifier').classList.remove('show');
            localStorage.setItem('lastSeenAnnouncement', Date.now());
        }
        target.classList.add('active');
    }));

    window.addEventListener('DOMContentLoaded', () => {
        createMinecraftBlocks(); initServerMonitor(); initPlayerList(); initChat();
        
        // Observe static elements (Feature Grid)
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        
        loadData('abilities', 'abilities-container', renderAbil);
        loadData('subAbilities', 'sub-abilities-container', renderSub);
        loadData('rules', 'rules-list-container', renderRule);
        loadData('announcements', 'announcements-container', renderAnn, true);
        document.getElementById('web-message').addEventListener('keypress', (e) => { if(e.key==='Enter') sendToMinecraft(); });
    });
