// --- BIGFISH WEB HUD: TOTAL SYNC (v8.9) ---
import { dbService } from './firebase-service.js';
import Auth from './auth.js';

const Visualizer = {
    activeVideo: document.getElementById('video-active'),
    bufferVideo: document.getElementById('video-buffer'),
    statusText: document.getElementById('ai-state-text'),
    subText: document.getElementById('ai-sub-text'),
    
    currentState: 'IDLE',
    targetState: null,
    
    assets: {
        'IDLE': 'assets/fish_idle.mp4',
        'THINKING': 'assets/fish_thinking.mp4',
        'SPEAKING': 'assets/fish_idle.mp4'
    },

    init() {
        if (!this.activeVideo || !this.bufferVideo) return;

        // Initialize First Engine
        this.activeVideo.src = this.assets['IDLE'];
        this.activeVideo.load();
        this.activeVideo.play().catch(e => console.log("Autoplay check"));
        
        // Listen for loop ends to perform seamless swaps
        this.bindLoopListener();
    },

    bindLoopListener() {
        this.activeVideo.onended = () => this.handleCycleEnd();
    },
    
    setState(state, turn, maxTurns) {
        if (!state) return;
        state = state.toUpperCase();
        
        let label = "IDLE";
        let sub = "System Standby";
        
        switch (state.toLowerCase()) {
            case 'thinking':
                label = "PROCESSING";
                sub = turn ? "REASONING LOOP: " + turn + "/" + (maxTurns || 10) : "Neural Engine Active";
                break;
            case 'speaking':
                label = "SPEAKING";
                sub = "Transmitting Audio...";
                break;
            default:
                label = "ONLINE";
                sub = "Listening for commands...";
        }

        if (this.statusText) this.statusText.textContent = label;
        if (this.subText) this.subText.textContent = sub;

        // Visual Filter Updates (Immediate)
        this.updateFilters(state);

        if (state === this.currentState && !this.targetState) return;

        // Check if we need to swap the actual video file
        const targetFile = this.assets[state] || this.assets['IDLE'];
        const currentFile = this.activeVideo.getAttribute('src');

        if (currentFile && !currentFile.endsWith(targetFile)) {
            console.log("[VISUALIZER] Queuing transition to: " + state);
            this.targetState = state;
            this.activeVideo.loop = false; // Stop internal loop so 'ended' triggers
        } else {
            this.currentState = state;
            this.targetState = null;
            this.activeVideo.loop = true; // Ensure it keeps looping
            if (this.activeVideo.paused) this.activeVideo.play();
        }
    },

    handleCycleEnd() {
        if (this.targetState) {
            const targetFile = this.assets[this.targetState];
            this.swapVideo(targetFile);
            this.currentState = this.targetState;
            this.targetState = null;
        } else {
            // Standard loop fallback if something went wrong with the 'loop' attribute
            this.activeVideo.currentTime = 0;
            this.activeVideo.play().catch(e => {});
        }
    },

    swapVideo(newSrc) {
        console.log("[VISUALIZER] Swapping video engine...");
        this.bufferVideo.src = newSrc;
        this.bufferVideo.load();
        
        this.bufferVideo.play().then(() => {
            this.bufferVideo.classList.remove('hidden');
            this.activeVideo.classList.add('hidden');
            
            setTimeout(() => {
                this.activeVideo.pause();
                this.activeVideo.currentTime = 0;
                
                // Swap references
                const temp = this.activeVideo;
                this.activeVideo = this.bufferVideo;
                this.bufferVideo = temp;
                
                this.activeVideo.loop = true; 
                this.bindLoopListener();
                
            }, 1000);
        }).catch(e => {
            // Failsafe
            this.activeVideo.src = newSrc;
            this.activeVideo.loop = true;
            this.activeVideo.play();
        });
    },

    updateFilters(state) {
        const classes = ['state-idle', 'state-thinking', 'state-speaking'];
        [this.activeVideo, this.bufferVideo].forEach(v => {
            if (!v) return;
            v.classList.remove(...classes);
            v.classList.add('state-' + state.toLowerCase());
        });
    }
};

const UI = {
    elements: {
        appContainer: document.getElementById('app-container'),
        cpuBar: document.getElementById('cpu-bar'),
        cpuVal: document.getElementById('cpu-val'),
        ramBar: document.getElementById('ram-bar'),
        ramVal: document.getElementById('ram-val'),
        tempVal: document.getElementById('temp-val'),
        logFeed: document.getElementById('log-feed'),
        cmdInput: document.getElementById('cmd-input'),
        btnSend: document.getElementById('btn-send'),
        netDot: document.getElementById('net-status-dot'),
        netText: document.getElementById('net-status-text'),
        keyList: document.getElementById('key-list')
    },
    
    lastStatusId: 0,

    init() {
        Auth.init();
        document.addEventListener('auth:success', () => {
            this.elements.appContainer.classList.remove('hidden');
            this.connectDataStreams();
        });

        this.elements.btnSend.addEventListener('click', () => this.handleInput());
        this.elements.cmdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleInput(); });

        document.getElementById('btn-clear-logs').onclick = () => { this.elements.logFeed.innerHTML = ''; };
        
        const btnToggle = document.getElementById('btn-toggle-logs');
        if(btnToggle) btnToggle.onclick = () => { this.elements.appContainer.classList.toggle('log-focus'); };

        const btnAddKey = document.getElementById('btn-add-key');
        if(btnAddKey) {
            btnAddKey.onclick = () => {
                const input = document.getElementById('new-key-input');
                if(input.value) { dbService.addKey(input.value); input.value = ''; }
            };
        }

        document.addEventListener('sys:connection', (e) => {
            const online = e.detail.online;
            this.elements.netDot.className = 'status-dot ' + (online ? 'online' : 'offline');
            this.elements.netText.textContent = online ? 'ONLINE' : 'OFFLINE';
        });
    },

    connectDataStreams() {
        dbService.subscribeToStats((val) => this.updateStats(val));
        dbService.subscribeToLogs((val) => this.processIncomingLog(val));
        dbService.subscribeToKeys((val) => this.updateKeys(val));
        
        // ADD STREAMING LOGS SUBSCRIPTION
        if (dbService.subscribeToStreamingLogs) {
            dbService.subscribeToStreamingLogs((val) => this.processIncomingLog(val));
        }
    },

    handleInput() {
        const txt = this.elements.cmdInput.value.trim();
        if (!txt) return;
        this.addLog({ message: txt, type: 'user' });
        this.lastStatusId = Date.now(); 
        Visualizer.setState('THINKING', 1, 10);
        dbService.sendCommand(txt);
        this.elements.cmdInput.value = '';
    },

    updateStats(stats) {
        if (!stats) return;
        const sid = stats.status_id || 0;
        if (sid < this.lastStatusId && stats.ai_status !== 'IDLE') return;
        this.lastStatusId = sid;

        if (stats.ai_status) {
            Visualizer.setState(stats.ai_status, stats.current_turn, stats.max_turns);
        }

        if (stats.resources) {
            const r = stats.resources;
            if (this.elements.cpuBar) this.elements.cpuBar.style.width = r.cpu;
            if (this.elements.cpuVal) this.elements.cpuVal.textContent = r.cpu;
            if (this.elements.ramBar) this.elements.ramBar.style.width = r.ram;
            if (this.elements.ramVal) this.elements.ramVal.textContent = r.ram;
            if (this.elements.tempVal) this.elements.tempVal.textContent = r.temp;
        }
    },

    updateKeys(keys) {
        if (!keys || !this.elements.keyList) return;
        this.elements.keyList.innerHTML = '';
        var self = this;
        keys.forEach(function(k, i) {
            var div = document.createElement('div');
            div.className = 'key-item';
            div.innerHTML = '<span>...' + k.substr(-4) + '</span><button class="remove-key-btn" data-idx="' + i + '">×</button>';
            self.elements.keyList.appendChild(div);
        });
        const btns = this.elements.keyList.querySelectorAll('.remove-key-btn');
        btns.forEach(btn => {
            btn.onclick = (e) => { dbService.removeKey(parseInt(e.target.getAttribute('data-idx'))); };
        });
    },

    processIncomingLog(log) {
        if (!log || !log.message) return;
        const typeMap = {
            'info': 'system-msg', 
            'error': 'error', 
            'tool_exec': 'tool', 
            'tool_result': 'tool', 
            'user': 'user', 
            'ai_raw': 'ai-thought',
            'ai_voice': 'ai-voice',
            'ai_response': 'ai-response'
        };
        this.addLog({ message: log.message, type: typeMap[log.type] || 'system-msg' });
    },

    addLog(logData) {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        
        // STREAMING OPTIMIZATION:
        // If it's a 'raw' or 'voice' type, check if the last log was the same and append
        const lastEntry = this.elements.logFeed.lastElementChild;
        const isStreamingType = logData.type === 'ai-thought' || logData.type === 'ai-voice';
        
        if (lastEntry && lastEntry.classList.contains(logData.type) && isStreamingType) {
            const msgEl = lastEntry.querySelector('.msg');
            msgEl.textContent += (logData.message.startsWith(' ') ? '' : ' ') + logData.message;
        } else {
            const entry = document.createElement('div');
            entry.className = 'log-entry ' + logData.type;
            
            // Hardcoded Logic for Labels & Colors (Matches TV HUD)
            let label = 'SYS';
            let color = '#00f0ff'; // Default System Cyan

            switch(logData.type) {
                case 'user': label = 'USER'; color = '#ccc'; break;
                case 'ai-thought': label = 'THOUGHT'; color = '#bc13fe'; break;
                case 'ai-voice': label = 'VOICE'; color = '#05ffa1'; break;
                case 'ai-response': label = 'RESPONSE'; color = '#ffffff'; break;
                case 'tool': label = 'TOOL'; color = '#ff9d00'; break;
                case 'error': label = 'ERROR'; color = '#ff2a6d'; break;
            }

            entry.style.borderLeftColor = color;
            entry.innerHTML = `
                <div class="meta">
                    <span class="label" style="color: ${color}">${label}</span>
                    <span class="ts">${time}</span>
                </div>
                <div class="msg">${logData.message}</div>
            `;
            this.elements.logFeed.appendChild(entry);
        }

        this.elements.logFeed.scrollTop = this.elements.logFeed.scrollHeight;
        if (this.elements.logFeed.children.length > 150) this.elements.logFeed.removeChild(this.elements.logFeed.firstChild);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Visualizer.init();
    UI.init();
});
