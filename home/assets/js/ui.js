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
        sttBtn: document.getElementById('btn_stt'),
        slashBtn: document.getElementById('btn_slash'),
        volSlider: document.getElementById('vol_slider'),
        volVal: document.getElementById('vol_val'),
        slashSuggestions: document.getElementById('slash_suggestions')
    },

    slashCommands: [
        { name: '/play', desc: 'Instant Music', placeholder: '/play ' },
        { name: '/stop', desc: 'Kill Media', placeholder: '/stop' },
        { name: '/restart', desc: 'Reboot Bridge', placeholder: '/restart' },
        { name: '/help', desc: 'Show Shortcuts', placeholder: '/help' }
    ],

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

        // Volume Slider Logic
        if (UI.elements.volSlider) {
            UI.elements.volSlider.oninput = (e) => {
                if (UI.elements.volVal) UI.elements.volVal.textContent = e.target.value;
            };
            UI.elements.volSlider.onchange = (e) => {
                const val = e.target.value;
                if (window.pushVolumeCommand) window.pushVolumeCommand(val);
            };
        }

        // Slash Command Suggestions
        if (UI.elements.aiInput) {
            UI.elements.aiInput.addEventListener('input', (e) => {
                const val = e.target.value;
                if (val.startsWith('/')) {
                    const filter = val.substring(1).toLowerCase();
                    UI.showSlashSuggestions(filter);
                } else {
                    UI.hideSlashSuggestions();
                }
            });

            UI.elements.aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') UI.hideSlashSuggestions();
            });
        }

        // Manual Slash Button Trigger
        if (UI.elements.slashBtn) {
            UI.elements.slashBtn.onclick = (e) => {
                e.stopPropagation();
                if (UI.elements.slashSuggestions && UI.elements.slashSuggestions.style.display === 'block') {
                    UI.hideSlashSuggestions();
                } else {
                    UI.showSlashSuggestions("");
                }
            };
        }

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (UI.elements.slashSuggestions && !UI.elements.slashSuggestions.contains(e.target) && e.target !== UI.elements.aiInput) {
                UI.hideSlashSuggestions();
            }
        });

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
        
        let isOnline = info.status === 'ONLINE';
        
        // 30-Second Timeout Logic
        if (info.last_pulse_ts) {
            const now = Date.now() / 1000;
            const diff = now - info.last_pulse_ts;
            if (diff > 30) isOnline = false;
        }

        if (UI.elements.status) {
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
                
                // Reset button state if it's visible (or just always reset it)
                if (isWorking) {
                    // Only reset if we are NOT currently in the middle of a stop request? 
                    // Actually, if server info updates, we should reflect reality. 
                    // If status is still WORKING, maybe we keep it as is?
                    // But if this runs frequently, it might override the "STOPPING..." text.
                    
                    // Let's only reset if the text is stuck or if we want to ensure it's clickable again.
                    // A safer bet: If status changed to something else, or if enough time passed.
                    // For simplicity, let's just make sure it's enabled if it's shown.
                    // But wait, if I just clicked it, and this update runs 100ms later with old status, it will reset my "STOPPING...".
                    
                    // BETTER APPROACH: Don't reset text here blindly. 
                    // But we MUST enable it if it was disabled and we are still working? No.
                    
                    // Let's just leave it alone here. The logic in app.js sets it to "STOPPING...". 
                    // When status becomes IDLE, it hides. 
                    // When it shows up again (next turn), it should be "TERMINATE".
                    
                    // So we DO need to reset it when it RE-APPEARS.
                    if (btnTerminate.style.display === 'inline-block' && btnTerminate.textContent === 'STOPPING...' && aiState !== 'IDLE') {
                         // It's still working, maybe the stop didn't happen yet. 
                         // Let's leave it as STOPPING... for visual continuity until it actually disappears.
                    } else {
                        btnTerminate.textContent = 'TERMINATE';
                        btnTerminate.disabled = false;
                        btnTerminate.style.opacity = '1';
                    }
                }
            }
        }

        if (UI.elements.currentTurn) {
            UI.elements.currentTurn.textContent = info.current_turn || 0;
        }

        // Update Volume Slider if not currently being touched
        if (info.volume !== undefined && UI.elements.volSlider) {
            // Only update if the user isn't actively sliding it
            if (document.activeElement !== UI.elements.volSlider) {
                UI.elements.volSlider.value = info.volume;
                if (UI.elements.volVal) UI.elements.volVal.textContent = info.volume;
            }
        }

        // Active Key Highlight from Server Info
        if (info.current_key_idx !== undefined) {
            UI.updateActiveKeyIndex(info.current_key_idx);
        }

        // Update Media Status
        if (info.now_playing) {
            UI.updateMediaInfo(info.now_playing);
        }

        // Update System Resources
        if (info.resources) {
            UI.updateResources(info.resources);
        }
    },

    updateResources: (res) => {
        const cpu = document.getElementById('res_cpu');
        const ram = document.getElementById('res_ram');
        const temp = document.getElementById('res_temp');
        if (cpu) cpu.textContent = res.cpu || '--%';
        if (ram) ram.textContent = res.ram || '--%';
        if (temp) temp.textContent = res.temp || '--°C';
    },

    updateMediaInfo: (media) => {
        const mediaTitle = document.getElementById('media_title');
        const mediaStatus = document.getElementById('media_status');
        const mediaContainer = document.getElementById('media_container');
        
        if (!mediaTitle || !mediaStatus) return;

        // Always show container now
        if (mediaContainer) mediaContainer.style.display = 'flex';

        const isPlaying = media.state === 'PLAYING';
        const isPaused = media.state === 'PAUSED';
        const hasTitle = media.title && media.title !== 'Unknown' && media.title !== 'NOT_IDENTIFIED';

        if (hasTitle) {
            mediaTitle.textContent = media.title;
            mediaStatus.textContent = isPlaying ? '▶ PLAYING' : '⏸ PAUSED';
            mediaStatus.className = `media-status ${isPlaying ? 'playing' : 'paused'}`;
        } else {
            mediaTitle.textContent = 'Nothing is playing right now';
            mediaStatus.textContent = 'IDLE';
            mediaStatus.className = 'media-status paused';
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
        if (type === 'tool_result') label = 'ENGINE_OUTPUT';
        if (type === 'error') label = 'FATAL_EXCEPTION';

        let content = log.message;

        // Terminal Color Logic
        if (type === 'tool_exec' || type === 'tool_result' || (type === 'info' && content.includes('SHELL_RESULT:'))) {
            if (typeof AnsiUp !== 'undefined') {
                const ansiUp = new AnsiUp();
                content = `<pre class="shell-output">${ansiUp.ansi_to_html(content)}</pre>`;
            } else {
                content = `<pre class="shell-output">${content}</pre>`;
            }
        } else if (type === 'ai_raw') {
            let safe = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            safe = safe.replace(/(AI THOUGHT:|THOUGHT:)(.*?)(?=\n|$)/g, '<div class="thought-box">$2</div>');
            safe = safe.replace(/(VOICE:)(.*?)(?=\n|$)/g, '<span class="cmd-badge voice-badge">$1 $2</span>');
            safe = safe.replace(/(TOOL:)(.*?)(?=\n|$)/g, '<span class="cmd-badge tool-badge">$1 $2</span>');
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

        // LOCAL TTS - Only for voice-tagged messages
        if (log.is_voice && UI.settings.tts && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(log.message);
            window.speechSynthesis.speak(utterance);
        }
        
        if (onRender) onRender(log.id);
    },

    clearLogs: () => {
        if (UI.elements.logContent) UI.elements.logContent.innerHTML = "";
    },

    showSlashSuggestions: (filter = "") => {
        if (!UI.elements.slashSuggestions) return;
        const count = UI.renderSlashSuggestions(filter);
        if (count > 0) {
            UI.elements.slashSuggestions.style.display = 'block';
        } else {
            UI.elements.slashSuggestions.style.display = 'none';
        }
    },

    hideSlashSuggestions: () => {
        if (UI.elements.slashSuggestions) {
            UI.elements.slashSuggestions.style.display = 'none';
        }
    },

    renderSlashSuggestions: (filter = "") => {
        const container = UI.elements.slashSuggestions;
        container.innerHTML = '';
        
        const filtered = UI.slashCommands.filter(cmd => 
            cmd.name.toLowerCase().includes('/' + filter)
        );

        filtered.forEach(cmd => {
            const div = document.createElement('div');
            div.className = 'slash-item';
            div.innerHTML = `
                <span class="cmd-name">${cmd.name}</span>
                <span class="cmd-desc">${cmd.desc}</span>
            `;
            div.onclick = () => {
                UI.elements.aiInput.value = cmd.placeholder;
                UI.elements.aiInput.focus();
                UI.hideSlashSuggestions();
                // Auto-trigger resize
                UI.elements.aiInput.dispatchEvent(new Event('input'));
            };
            container.appendChild(div);
        });

        return filtered.length;
    }
};
