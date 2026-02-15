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

    updateServerInfo: (info) => {
        if (UI.elements.ip) UI.elements.ip.textContent = info.ip || 'OFFLINE';
        if (UI.elements.status) {
            UI.elements.status.textContent = info.status || 'UNKNOWN';
            UI.elements.status.style.color = info.status === 'ONLINE' ? 'var(--accent)' : 'var(--danger)';
        }
    },

    updateActiveKeyIndex: (index) => {
        if (UI.elements.keyIdx) UI.elements.keyIdx.textContent = `#${index}`;
    },

    renderKeys: (keys, activeIndex, onDelete) => {
        if (!UI.elements.keyList) return;
        UI.elements.keyList.innerHTML = "";
        keys.forEach((key, i) => {
            const div = document.createElement('div');
            div.className = `key-item ${i === activeIndex ? 'key-active' : ''}`;
            div.innerHTML = `
                <span>${key.substring(0, 8)}...</span>
                <button class="key-del" data-idx="${i}">×</button>
            `;
            div.querySelector('.key-del').onclick = () => onDelete(i);
            UI.elements.keyList.appendChild(div);
        });
    },

    appendLog: (log, onRender) => {
        if (!UI.elements.logContent) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const typeClass = log.type ? `log-type-${log.type}` : '';
        const timestamp = log.timestamp ? new Date(log.timestamp * 1000).toLocaleTimeString() : '--:--:--';
        
        entry.innerHTML = `
            <span class="log-ts">[${timestamp}]</span>
            <span class="${typeClass}">${log.message}</span>
        `;
        
        UI.elements.logContent.appendChild(entry);
        UI.elements.logContent.scrollTop = UI.elements.logContent.scrollHeight;
        
        if (onRender) onRender(log.id);
    },

    clearLogs: () => {
        if (UI.elements.logContent) UI.elements.logContent.innerHTML = "";
    }
};
