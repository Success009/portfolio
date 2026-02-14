export const UI = {
    elements: {
        ip: document.getElementById('ip'),
        status: document.getElementById('status'),
        keyIdx: document.getElementById('key_idx'),
        keyList: document.getElementById('key_list'),
        logContent: document.getElementById('log_content'),
        newKeyInput: document.getElementById('new_key'),
        aiInput: document.getElementById('ai_in'),
        ttsInput: document.getElementById('tts_in'),
        btnClearLogs: document.getElementById('btn_clear_logs')
    },

    _lastServerInfo: {},

    updateServerInfo: (info) => {
        UI._lastServerInfo = info;
        UI.elements.ip.innerText = info.ip || "OFFLINE";
        UI.elements.status.innerText = info.status || "UNKNOWN";
    },

    updateActiveKeyIndex: (index) => {
        UI.elements.keyIdx.innerText = index;
    },

    renderKeys: (keys, activeIndex, onDelete) => {
        UI.elements.keyList.innerHTML = "";
        const statuses = UI._lastServerInfo.key_statuses || {};
        
        keys.forEach((k, i) => {
            if (!k) return;
            const div = document.createElement('div');
            div.className = 'key-item ' + (i === activeIndex ? 'key-active' : '');
            
            const statusInfo = Object.values(statuses).find(s => s.index === i) || { status: 'UNKNOWN' };
            const isBad = statusInfo.status.includes('COOLDOWN') || statusInfo.status.includes('EXHAUSTED');
            
            if (isBad) div.style.color = '#ffaa00';
            
            const mask = k.substring(0, 4) + "..." + k.substring(k.length - 4);
            
            const textSpan = document.createElement('span');
            textSpan.innerHTML = `[${i}] ${mask} <small style="font-size:8px; opacity:0.7;">(${statusInfo.status})</small>`;
            
            const delSpan = document.createElement('span');
            delSpan.style.cursor = 'pointer';
            delSpan.style.color = '#ff5555';
            delSpan.innerText = '[X]';
            delSpan.onclick = () => onDelete(i);
            
            div.appendChild(textSpan);
            div.appendChild(delSpan);
            UI.elements.keyList.appendChild(div);
        });
    },

    appendLog: (log, onMarkRead) => {
        const entry = document.createElement('div');
        entry.id = 'log-' + (log.id || Date.now()); // Fallback ID
        entry.className = 'log-entry' + (log.read ? '' : ' unread');
        
        const time = new Date(log.timestamp * 1000).toLocaleTimeString();
        let typeClass = 'log-type-info';
        if (log.message.includes('AI THOUGHT')) typeClass = 'log-type-ai';
        if (log.type === 'watcher') typeClass = 'log-type-watcher';
        
        const readBtn = log.read ? '' : `<button class="mark-read-btn" style="font-size:8px; padding:1px 3px; margin-left:10px; cursor:pointer; background:#222; border:1px solid #444; color:#888;">READ</button>`;

        entry.innerHTML = `<span class="log-ts">[${time}]</span> <span class="${typeClass}">${log.message}</span> ${readBtn}`;
        
        if (!log.read && onMarkRead) {
            const btn = entry.querySelector('.mark-read-btn');
            if(btn) btn.onclick = () => onMarkRead(log.id);
        }

        UI.elements.logContent.appendChild(entry);
        
        // Prune old logs
        if (UI.elements.logContent.children.length > 100) {
            UI.elements.logContent.removeChild(UI.elements.logContent.firstChild);
        }

        // Scroll to bottom with a slight delay to ensure layout is updated
        setTimeout(() => {
            UI.elements.logContent.scrollTop = UI.elements.logContent.scrollHeight;
        }, 0);
    },

    clearInputs: () => {
        UI.elements.newKeyInput.value = "";
        UI.elements.aiInput.value = "";
        UI.elements.ttsInput.value = "";
    },

    clearLogs: () => {
        UI.elements.logContent.innerHTML = "";
    }
};
