export const UI = {
    elements: {
        ip: document.getElementById('ip'),
        status: document.getElementById('status'),
        statusDot: document.getElementById('status_dot'),
        keyList: document.getElementById('key_list'),
        logContent: document.getElementById('log_content'),
        newKeyInput: document.getElementById('new_key'),
        aiInput: document.getElementById('ai_in'),
        aiStatusText: document.getElementById('ai_status_text'),
        currentTurn: document.getElementById('current_turn'),
        sidebar: document.querySelector('.sidebar'),
        sidebarOverlay: document.getElementById('sidebar_overlay'),
        settingsModal: document.getElementById('settings_modal'),
        sttBtn: document.getElementById('btn_stt')
    },

    settings: {
        tts: localStorage.getItem('dash_tts') === 'true',
        stt: localStorage.getItem('dash_stt') === 'true'
    },

    init: () => {
        // Init Toggle Switches
        const ttsCheck = document.getElementById('setting_tts');
        const sttCheck = document.getElementById('setting_stt');
        
        if (ttsCheck) {
            ttsCheck.checked = UI.settings.tts;
            ttsCheck.onchange = (e) => {
                UI.settings.tts = e.target.checked;
                localStorage.setItem('dash_tts', e.target.checked);
            };
        }
        
        if (sttCheck) {
            sttCheck.checked = UI.settings.stt;
            UI.updateSTTVisibility();
            sttCheck.onchange = (e) => {
                UI.settings.stt = e.target.checked;
                localStorage.setItem('dash_stt', e.target.checked);
                UI.updateSTTVisibility();
            };
        }

        // Global Listeners for Sidebar/Settings
        const btnMenu = document.getElementById('btn_menu_toggle');
        if (btnMenu) btnMenu.onclick = () => UI.toggleSidebar(true);
        if (UI.elements.sidebarOverlay) UI.elements.sidebarOverlay.onclick = () => UI.toggleSidebar(false);

        const btnSettings = document.getElementById('btn_settings');
        if (btnSettings) btnSettings.onclick = () => UI.toggleSettings(true);

        const btnCloseSettings = document.getElementById('btn_close_settings');
        if (btnCloseSettings) btnCloseSettings.onclick = () => UI.toggleSettings(false);
    },

    toggleSidebar: (show) => {
        if (!UI.elements.sidebar) return;
        if (show) {
            UI.elements.sidebar.classList.add('open');
            if (UI.elements.sidebarOverlay) UI.elements.sidebarOverlay.style.display = 'block';
        } else {
            UI.elements.sidebar.classList.remove('open');
            if (UI.elements.sidebarOverlay) UI.elements.sidebarOverlay.style.display = 'none';
        }
    },

    toggleSettings: (show) => {
        if (!UI.elements.settingsModal) return;
        UI.elements.settingsModal.style.display = show ? 'flex' : 'none';
    },

    updateSTTVisibility: () => {
        if (UI.elements.sttBtn) {
            UI.elements.sttBtn.style.display = UI.settings.stt ? 'flex' : 'none';
        }
    },

    updateServerInfo: (info) => {
        if (UI.elements.ip) UI.elements.ip.textContent = info.ip || 'OFFLINE';
        
        if (UI.elements.status) {
            const isOnline = info.status === 'ONLINE';
            UI.elements.status.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
            if (UI.elements.statusDot) {
                UI.elements.statusDot.className = `dot ${isOnline ? 'dot-online' : 'dot-offline'}`;
            }
        }

        const aiState = info.ai_status || 'IDLE';
        if (UI.elements.aiStatusText) {
            UI.elements.aiStatusText.textContent = aiState;
            UI.elements.aiStatusText.style.color = (aiState === 'IDLE' || aiState === 'OFFLINE') ? 'var(--text-muted)' : 'var(--primary)';
            
            // Handle Terminate Button Visibility
            const btnTerminate = document.getElementById('btn_terminate');
            if (btnTerminate) {
                // Show button if NOT idle and NOT offline
                const isWorking = aiState !== 'IDLE' && aiState !== 'OFFLINE';
                btnTerminate.style.display = isWorking ? 'inline-block' : 'none';
            }
        }

        if (UI.elements.currentTurn) {
            UI.elements.currentTurn.textContent = info.current_turn || 0;
        }

        // Active Key Highlight from Server Info
        if (info.current_key_idx !== undefined) {
            UI.updateActiveKeyIndex(info.current_key_idx);
        }
    },

    updateActiveKeyIndex: (index) => {
        const items = document.querySelectorAll('.key-item');
        items.forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    },

    renderKeys: (keys, activeIndex, onDelete) => {
        if (!UI.elements.keyList) return;
        UI.elements.keyList.innerHTML = "";
        keys.forEach((key, i) => {
            const div = document.createElement('div');
            div.className = `key-item ${i === activeIndex ? 'active' : ''}`;
            const masked = key.length > 10 ? `${key.substring(0, 4)}...${key.substring(key.length-4)}` : key;
            
            div.innerHTML = `
                <span>${masked}</span>
                <button class="btn-del" data-idx="${i}">×</button>
            `;
            div.querySelector('.btn-del').onclick = (e) => {
                e.stopPropagation();
                onDelete(i);
            };
            UI.elements.keyList.appendChild(div);
        });
    },

    appendLog: (log, onRender) => {
        if (!UI.elements.logContent) return;
        
        const area = UI.elements.logContent;
        const isAtBottom = area.scrollHeight - area.clientHeight <= area.scrollTop + 100;

        const entry = document.createElement('div');
        const type = log.type || 'info';
        entry.className = `log-entry type-${type}`;
        
        const timestamp = log.timestamp ? new Date(log.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '--:--:--';
        
        let label = 'SYSTEM_EVENT';
        if (type === 'ai_raw') label = 'AGENT_RESPONSE';
        if (type === 'tool_exec') label = 'ENGINE_TASK';
        if (type === 'error') label = 'FATAL_EXCEPTION';

        let content = log.message;

        // Terminal Color Logic
        if (type === 'tool_exec' || (type === 'info' && content.includes('SHELL_RESULT:'))) {
            if (typeof AnsiUp !== 'undefined') {
                const ansiUp = new AnsiUp();
                content = ansiUp.ansi_to_html(content);
            } else {
                console.warn("AnsiUp not loaded. Rendering raw text.");
            }
        } else if (type === 'ai_raw') {
            let safe = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            safe = safe.replace(/(AI THOUGHT:|THOUGHT:)(.*?)(?=\n|$)/g, '<div class="thought-box">$2</div>');
            safe = safe.replace(/(CMD:|TOOL:)(.*?)(?=\n|$)/g, '<span class="cmd-badge">$1 $2</span>');
            content = `<div class="output-text">${safe.replace(/\n/g, '<br>')}</div>`;
        }

        entry.innerHTML = `
            <div class="log-header">
                <span>[ ${label} ]</span>
                <span style="margin-left:auto">${timestamp}</span>
            </div>
            <div class="log-body">${content}</div>
        `;
        
        area.appendChild(entry);
        
        if (isAtBottom) {
            area.scrollTop = area.scrollHeight;
        }

        // LOCAL TTS
        if (type === 'ai_raw' && UI.settings.tts && window.speechSynthesis) {
            let speakText = log.message
                .replace(/(AI THOUGHT:|THOUGHT:)(.*?)(?=\n|$)/g, '') // Remove thoughts
                .replace(/(CMD:|TOOL:)(.*?)(?=\n|$)/g, '')    // Remove commands
                .replace(/```[\s\S]*?```/g, '')               // Remove code blocks
                .trim();
            
            if (speakText) {
                const utterance = new SpeechSynthesisUtterance(speakText);
                window.speechSynthesis.speak(utterance);
            }
        }
        
        if (onRender) onRender(log.id);
    },

    clearLogs: () => {
        if (UI.elements.logContent) UI.elements.logContent.innerHTML = "";
    }
};
