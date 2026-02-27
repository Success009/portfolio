import { dbService } from './firebase-service.js';
import Auth from './auth.js';

// --- VISUALIZER CONTROLLER ---
const Visualizer = {
    elem: document.getElementById('core-video'),
    statusText: document.getElementById('ai-state-text'),
    subText: document.getElementById('ai-sub-text'),
    
    setState(state) {
        if (!this.elem) return;
        
        // Reset classes
        this.elem.classList.remove('state-idle', 'state-thinking', 'state-speaking', 'state-error');
        
        let label = "IDLE";
        let sub = "System Standby";
        let playbackRate = 1.0;
        
        switch (state.toLowerCase()) {
            case 'thinking':
            case 'working':
            case 'processing':
                this.elem.classList.add('state-thinking');
                label = "PROCESSING";
                sub = "Neural Engine Active";
                playbackRate = 1.5;
                break;
            case 'speaking':
            case 'voice':
                this.elem.classList.add('state-speaking');
                label = "SPEAKING";
                sub = "Audio Output Active";
                playbackRate = 1.0;
                break;
            case 'error':
            case 'offline':
                this.elem.classList.add('state-error');
                label = "OFFLINE";
                sub = "Connection Lost";
                playbackRate = 0.5;
                break;
            default:
                this.elem.classList.add('state-idle');
                label = "ONLINE";
                sub = "Listening for commands...";
                playbackRate = 1.0;
        }
        
        if (this.elem.playbackRate !== undefined) {
            this.elem.playbackRate = playbackRate;
        }
        
        if (this.statusText) this.statusText.textContent = label;
        if (this.subText) this.subText.textContent = sub;
    }
};

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

    init() {
        // Initialize Auth Module
        Auth.init();

        // Listen for Auth Success
        document.addEventListener('auth:success', () => {
            this.elements.appContainer.classList.remove('hidden');
            this.connectDataStreams();
        });

        document.addEventListener('auth:logout', () => {
            this.elements.appContainer.classList.add('hidden');
        });

        // App Listeners
        this.elements.btnSend.addEventListener('click', () => this.handleInput());
        this.elements.cmdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleInput();
        });

        document.getElementById('btn-clear-logs').onclick = () => {
            this.elements.logFeed.innerHTML = '';
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
        dbService.subscribeToLogs((val) => this.addLog(val));
        dbService.subscribeToKeys((val) => this.updateKeys(val));
    },

    handleInput() {
        const txt = this.elements.cmdInput.value.trim();
        if (!txt) return;
        
        this.addLog({ message: `> ${txt}`, type: 'user' });
        dbService.sendCommand(txt);
        this.elements.cmdInput.value = '';
    },

    updateStats(stats) {
        if (!stats) return;
        
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

        if (stats.ai_status) Visualizer.setState(stats.ai_status);
        if (stats.now_playing) this.updateMedia(stats.now_playing);
    },

    addLog(log) {
        const entry = document.createElement('div');
        const typeClass = log.type === 'ai_raw' ? 'ai' : (log.type === 'tool_exec' ? 'tool' : '');
        entry.className = `log-entry ${typeClass}`;
        
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        let content = log.message;
        if (typeof AnsiUp !== 'undefined' && (log.message.includes('[3') || log.message.includes('[0'))) {
             const ansi = new AnsiUp();
             content = ansi.ansi_to_html(content);
        }
        
        entry.innerHTML = `<span class="ts">[${time}]</span><span class="msg">${content}</span>`;
        this.elements.logFeed.appendChild(entry);
        this.elements.logFeed.scrollTop = this.elements.logFeed.scrollHeight;
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
