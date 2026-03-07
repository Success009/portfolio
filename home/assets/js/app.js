// --- BIGFISH WEB HUD: SINGLE-FILE SPRITE ENGINE (v12.0) ---
import { dbService } from './firebase-service.js';
import Auth from './auth.js';

const Visualizer = {
    vEngine: document.getElementById('video-active'),
    statusText: document.getElementById('ai-state-text'),
    subText: document.getElementById('ai-sub-text'),
    
    currentState: 'IDLE',
    
    // SPRITE MAP: { StartTime, EndTime }
    segments: {
        'IDLE': { start: 0.0, end: 5.37 },
        'THINKING': { start: 5.61, end: 6.98 },
        'SPEAKING': { start: 0.0, end: 5.37 } // Speaking uses Idle visual for now
    },

    init() {
        if (!this.vEngine) return;

        this.vEngine.src = 'assets/fish_master.mp4';
        this.vEngine.muted = true;
        this.vEngine.load();
        
        // --- SEAMLESS SPRITE LOOPING ---
        this.vEngine.addEventListener('timeupdate', () => {
            const seg = this.segments[this.currentState];
            if (this.vEngine.currentTime >= seg.end) {
                this.vEngine.currentTime = seg.start;
                this.vEngine.play().catch(() => {});
            }
        });

        this.vEngine.play().catch(e => console.log("Autoplay check"));
    },
    
    setState(state, turn, maxTurns) {
        if (!state) return;
        state = state.toUpperCase();
        if (!this.segments[state]) state = 'IDLE';
        
        let label = "ONLINE";
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

        if (state === this.currentState) return;

        // --- PERFORM THE JUMP ---
        console.log(`[SPRITE] State change: ${this.currentState} -> ${state}`);
        this.currentState = state;
        const newSeg = this.segments[state];
        this.vEngine.currentTime = newSeg.start;
        this.vEngine.play().catch(() => {});
    },

    updateFilters(state) {
        const classes = ['state-idle', 'state-thinking', 'state-speaking'];
        if (!this.vEngine) return;
        this.vEngine.classList.remove(...classes);
        this.vEngine.classList.add('state-' + state.toLowerCase());
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
        const lastEntry = this.elements.logFeed.lastElementChild;
        const isStreamingType = logData.type === 'ai-thought' || logData.type === 'ai-voice';
        
        if (lastEntry && lastEntry.classList.contains(logData.type) && isStreamingType) {
            const msgEl = lastEntry.querySelector('.msg');
            msgEl.textContent += (logData.message.startsWith(' ') ? '' : ' ') + logData.message;
        } else {
            const entry = document.createElement('div');
            entry.className = 'log-entry ' + logData.type;
            
            let label = 'SYS';
            let color = '#00f0ff'; 

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
