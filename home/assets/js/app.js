import { dbService } from './firebase-service.js';
import Auth from './auth.js';

// --- VISUALIZER CONTROLLER ---
const Visualizer = {
    activeVideo: null,
    bufferVideo: null,
    statusText: null,
    subText: null,
    
    currentState: 'IDLE',
    targetState: null,
    isTransitioning: false,
    forceSyncTimer: null,
    
    assets: {
        'IDLE': 'assets/fish_idle.mp4',
        'THINKING': 'assets/fish_thinking.mp4',
        'SPEAKING': 'assets/fish_idle.mp4', 
        'ERROR': 'assets/fish_idle.mp4'
    },

    init() {
        this.activeVideo = document.getElementById('video-active');
        this.bufferVideo = document.getElementById('video-buffer');
        this.statusText = document.getElementById('ai-state-text');
        this.subText = document.getElementById('ai-sub-text');

        if (!this.activeVideo || !this.bufferVideo) return;

        // Initialize
        this.activeVideo.src = this.assets['IDLE'];
        this.activeVideo.load();
        this.activeVideo.play().catch(e => console.log("Autoplay blocked"));
        
        this.bindEvents();
    },

    bindEvents() {
        this.activeVideo.onended = () => this.handleVideoEnd();
    },
    
    setState(state) {
        let normalizedState = 'IDLE';
        let label = "IDLE";
        let sub = "System Standby";
        
        switch (state.toLowerCase()) {
            case 'thinking':
            case 'working':
            case 'processing':
                normalizedState = 'THINKING';
                label = "PROCESSING";
                sub = "Neural Engine Active";
                break;
            case 'speaking':
            case 'voice':
                normalizedState = 'SPEAKING';
                label = "SPEAKING";
                sub = "Audio Output Active";
                break;
            case 'error':
            case 'offline':
                normalizedState = 'ERROR';
                label = "OFFLINE";
                sub = "Connection Lost";
                break;
            default:
                normalizedState = 'IDLE';
                label = "ONLINE";
                sub = "Listening for commands...";
        }

        // Voice Priority: If currently speaking, don't show thinking
        if (this.currentState === 'SPEAKING' && normalizedState === 'THINKING') {
            console.log("[VISUALIZER] Suppressing THINKING while SPEAKING.");
            return;
        }

        if (this.statusText) this.statusText.textContent = label;
        if (this.subText) this.subText.textContent = sub;

        this.updateFilters(normalizedState);

        if (normalizedState === this.currentState && !this.targetState) return;
        
        this.targetState = normalizedState;
        
        const targetSrc = this.assets[normalizedState] || this.assets['IDLE'];
        const currentSrc = this.activeVideo.getAttribute('src') || "";

        if (currentSrc.endsWith(targetSrc)) {
            this.currentState = normalizedState;
            this.targetState = null;
            if (this.forceSyncTimer) clearTimeout(this.forceSyncTimer);
            return;
        }

        // FORCE SYNC: If we are going to IDLE from THINKING, don't wait forever
        if (normalizedState === 'IDLE' || normalizedState === 'SPEAKING') {
            if (this.forceSyncTimer) clearTimeout(this.forceSyncTimer);
            this.forceSyncTimer = setTimeout(() => {
                if (this.targetState === normalizedState) {
                    console.log("[VISUALIZER] Force Sync Triggered.");
                    this.handleVideoEnd();
                }
            }, 2000); // Max 2s of delay
        }

        console.log(`[VISUALIZER] Transition Queued: ${this.currentState} -> ${normalizedState}`);
    },

    handleVideoEnd() {
        if (this.forceSyncTimer) clearTimeout(this.forceSyncTimer);
        
        if (this.targetState) {
            const targetSrc = this.assets[this.targetState] || this.assets['IDLE'];
            this.swapVideo(targetSrc);
            this.currentState = this.targetState;
            this.targetState = null;
        } else {
            this.activeVideo.currentTime = 0;
            this.activeVideo.play().catch(e => {});
        }
    },

    swapVideo(newSrc) {
        console.log(`[VISUALIZER] Swapping to: ${newSrc}`);
        this.bufferVideo.src = newSrc;
        this.bufferVideo.load();
        
        this.bufferVideo.play().then(() => {
            this.bufferVideo.classList.remove('hidden');
            this.activeVideo.classList.add('hidden');
            
            setTimeout(() => {
                this.activeVideo.pause();
                this.activeVideo.currentTime = 0;
                const temp = this.activeVideo;
                this.activeVideo = this.bufferVideo;
                this.bufferVideo = temp;
                this.bindEvents();
                this.bufferVideo.onended = null;
            }, 1000);
        }).catch(e => {
            this.activeVideo.currentTime = 0;
            this.activeVideo.play().catch(e=>{});
        });
    },

    updateFilters(state) {
        const classes = ['state-idle', 'state-thinking', 'state-speaking', 'state-error'];
        [this.activeVideo, this.bufferVideo].forEach(v => {
            if (!v) return;
            v.classList.remove(...classes);
            v.classList.add(`state-${state.toLowerCase()}`);
        });
    }
};

// Start Visualizer immediately
document.addEventListener('DOMContentLoaded', () => Visualizer.init());

// --- UI CONTROLLER ---
const UI = {
    elements: {
        appContainer: document.getElementById('app-container'),
        cpuBar: document.getElementById('cpu-bar'),
        cpuVal: document.getElementById('cpu-val'),
        ramBar: document.getElementById('ram-bar'),
        ramVal: document.getElementById('ram-val'),
        tempVal: document.getElementById('temp-val'),
        netDot: document.getElementById('net-status-dot'),
        netText: document.getElementById('net-status-text'),
        logFeed: document.getElementById('log-feed'),
        cmdInput: document.getElementById('cmd-input'),
        btnSend: document.getElementById('btn-send'),
        keyList: document.getElementById('key-list'),
        mediaCard: document.getElementById('media-card'),
        mediaTitle: document.getElementById('media-title'),
        mediaStatus: document.getElementById('media-status')
    },
    
    streamsConnected: false,
    lastStatusId: 0,

    init() {
        // --- AUTH LISTENERS ---
        Auth.init();

        // Listen for Auth Success
        document.addEventListener('auth:success', () => {
            this.elements.appContainer.classList.remove('hidden');
            this.connectDataStreams();
        });

        document.addEventListener('auth:logout', () => {
            this.elements.appContainer.classList.add('hidden');
        });

        // --- SETTINGS MODAL ---
        const settingsModal = document.getElementById('settings-modal');
        document.getElementById('btn-settings').onclick = () => settingsModal.classList.remove('hidden');
        document.getElementById('btn-close-settings').onclick = () => settingsModal.classList.add('hidden');

        // Close modal on outside click
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) settingsModal.classList.add('hidden');
        };

        // --- APP LISTENERS ---
        this.elements.btnSend.addEventListener('click', () => this.handleInput());
        this.elements.cmdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleInput();
        });

        document.getElementById('btn-clear-logs').onclick = () => {
            this.elements.logFeed.innerHTML = '';
        };

        const btnToggle = document.getElementById('btn-toggle-logs');
        btnToggle.onclick = () => {
            const isFocus = this.elements.appContainer.classList.toggle('log-focus');
            btnToggle.textContent = isFocus ? '❐' : '⛶';
            btnToggle.title = isFocus ? 'Restore Layout' : 'Maximize Logs';
        };
        
        document.getElementById('btn-restart').onclick = () => {
            if(confirm("Confirm Bridge Restart?")) dbService.restartBridge();
        };
        
        document.getElementById('btn-add-key').onclick = () => {
            const input = document.getElementById('new-key-input');
            if(input.value) {
                dbService.addKey(input.value);
                input.value = '';
            }
        };

        document.addEventListener('sys:connection', (e) => {
            const online = e.detail.online;
            this.elements.netDot.className = `status-dot ${online ? 'online' : 'offline'}`;
            this.elements.netText.textContent = online ? 'ONLINE' : 'OFFLINE';
            if (!online) Visualizer.setState('offline');
            else Visualizer.setState('idle');
        });
    },

    connectDataStreams() {
        if (this.streamsConnected) return;
        this.streamsConnected = true;
        
        dbService.subscribeToStats((val) => this.updateStats(val));
        dbService.subscribeToLogs((val) => this.processIncomingLog(val));
        dbService.subscribeToKeys((val) => this.updateKeys(val));
    },

    handleInput() {
        const txt = this.elements.cmdInput.value.trim();
        if (!txt) return;
        
        // Optimistic UI update
        this.addLog({ message: txt, type: 'user' });
        
        // Set lock to NOW to prevent stale updates from BEFORE this command, 
        // but allow any update that comes AFTER.
        this.lastStatusId = Date.now(); 
        
        // Context-aware Visualizer feedback
        if (txt.startsWith('.')) {
            Visualizer.setState('SPEAKING');
        } else {
            Visualizer.setState('THINKING');
        }
        
        dbService.sendCommand(txt);
        this.elements.cmdInput.value = '';
    },

    updateStats(stats) {
        if (!stats) return;
        
        // 1. Atomic Sync Check
        const sid = stats.status_id || 0;
        
        // If server says IDLE, we should generally listen to it unless we just sent a command
        if (sid < this.lastStatusId && stats.ai_status !== 'IDLE') {
            console.log("[UI] Skipping stale status update.");
            return;
        }

        this.lastStatusId = sid;
        if (stats.ai_status) Visualizer.setState(stats.ai_status);

        // 2. Resources
        if (stats.resources) {
            const { cpu, ram, temp } = stats.resources;
            const cpuN = parseInt(cpu) || 0;
            const ramN = parseInt(ram) || 0;
            this.elements.cpuBar.style.width = `${cpuN}%`;
            this.elements.cpuVal.textContent = cpu || '--%';
            this.elements.ramBar.style.width = `${ramN}%`;
            this.elements.ramVal.textContent = ram || '--%';
            this.elements.tempVal.textContent = temp || '--°C';
        }

        // 3. Media
        if (stats.now_playing) this.updateMedia(stats.now_playing);
    },

    processIncomingLog(log) {
        if (!log || !log.message) return;

        // RAW AI PARSING (If it contains Thought/Voice/Tool)
        if (log.type === 'ai_raw') {
            const msg = log.message;
            
            // 1. Extract Thought
            const thoughtMatch = msg.match(/THOUGHT:\s*([\s\S]*?)(?=VOICE:|TOOL:|SIGNAL:|$)/i);
            if (thoughtMatch) this.addLog({ message: thoughtMatch[1].trim(), type: 'ai-thought' });

            // 2. Extract Voice
            const voiceMatch = msg.match(/VOICE:\s*([\s\S]*?)(?=TOOL:|SIGNAL:|$)/i);
            if (voiceMatch) this.addLog({ message: voiceMatch[1].trim(), type: 'ai-voice' });

            // 3. Extract Tools (optional, usually handled by tool_result logs)
            // But if no thought/voice found, show raw
            if (!thoughtMatch && !voiceMatch) this.addLog({ message: msg, type: 'ai-raw' });
            
            return;
        }

        // Standard Map
        const typeMap = {
            'info': 'system-msg',
            'error': 'error',
            'tool_exec': 'tool',
            'tool_result': 'tool',
            'user': 'user'
        };

        this.addLog({ message: log.message, type: typeMap[log.type] || 'system-msg' });
    },

    addLog(logData) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${logData.type}`;
        
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        
        let label = logData.type.replace('ai-', '').toUpperCase();
        if (label === 'SYSTEM-MSG') label = 'SYS';

        // Markdown-ish conversion
        let content = logData.message;
        
        // Handle ANSI
        if (typeof AnsiUp !== 'undefined' && (content.includes('[3') || content.includes('[0'))) {
             const ansi = new AnsiUp();
             content = ansi.ansi_to_html(content);
        }

        entry.innerHTML = `
            <div class="meta">
                <span class="label">${label}</span>
                <span class="ts">${time}</span>
            </div>
            <div class="msg">${content}</div>
        `;
        
        this.elements.logFeed.appendChild(entry);
        this.elements.logFeed.scrollTop = this.elements.logFeed.scrollHeight;
        
        // Limit history in DOM
        if (this.elements.logFeed.children.length > 100) {
            this.elements.logFeed.removeChild(this.elements.logFeed.firstChild);
        }
    },

    updateKeys(keys) {
        if (!keys) return;
        this.elements.keyList.innerHTML = '';
        keys.forEach((k, i) => {
            const div = document.createElement('div');
            div.className = 'key-item';
            div.innerHTML = `
                <span>...${k.substr(-4)}</span>
                <button onclick="window.removeKey(${i})" style="background:none;border:none;color:#ff2a6d;cursor:pointer;">×</button>
            `;
            this.elements.keyList.appendChild(div);
        });
        window.removeKey = (idx) => dbService.removeKey(idx);
    },

    updateMedia(media) {
        if (!media || !media.title || media.title === 'NOT_IDENTIFIED') {
            this.elements.mediaCard.classList.add('hidden');
            return;
        }
        this.elements.mediaCard.classList.remove('hidden');
        this.elements.mediaTitle.textContent = media.title;
        this.elements.mediaStatus.textContent = media.state === 'PLAYING' ? 'PLAYING' : 'PAUSED';
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());
