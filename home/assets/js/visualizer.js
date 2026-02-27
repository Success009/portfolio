// --- VISUALIZER CONTROLLER ---
const Visualizer = {
    activeVideo: null,
    bufferVideo: null,
    statusText: null,
    subText: null,
    
    currentState: 'IDLE',
    targetState: null,
    isTransitioning: false,
    
    // Mapping states to video files
    assets: {
        'IDLE': 'assets/fish_idle.mp4',
        'THINKING': 'assets/fish_thinking.mp4',
        'SPEAKING': 'assets/fish_idle.mp4', // Re-use idle for speaking with filters
        'ERROR': 'assets/fish_idle.mp4'
    },

    init() {
        this.activeVideo = document.getElementById('video-active');
        this.bufferVideo = document.getElementById('video-buffer');
        this.statusText = document.getElementById('ai-state-text');
        this.subText = document.getElementById('ai-sub-text');

        if (!this.activeVideo || !this.bufferVideo) return;

        // Initialize first video to ensure it plays
        this.activeVideo.src = this.assets['IDLE'];
        this.activeVideo.load();
        this.activeVideo.play().catch(e => console.log("Autoplay blocked, waiting for interaction:", e));
        
        // Listen for video end to handle looping/transitions
        this.activeVideo.addEventListener('ended', () => this.handleVideoEnd());
        // Buffer video doesn't need 'ended' listener until it becomes active
    },
    
    setState(newState) {
        // Normalize state
        let normalizedState = 'IDLE';
        let label = "IDLE";
        let sub = "System Standby";
        
        switch (newState.toLowerCase()) {
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

        // UI Text Updates (Immediate)
        if (this.statusText) this.statusText.textContent = label;
        if (this.subText) this.subText.textContent = sub;

        // CSS Filter Updates (Immediate)
        this.updateFilters(normalizedState);

        // Video Transition Logic
        if (normalizedState === this.currentState) return;
        
        this.targetState = normalizedState;
        
        // Determine target video file
        const targetSrc = this.assets[normalizedState] || this.assets['IDLE'];
        const currentSrc = this.activeVideo.getAttribute('src');

        // If switching files
        if (currentSrc && !currentSrc.endsWith(targetSrc)) {
            console.log(`[VISUALIZER] Queuing transition: ${this.currentState} -> ${this.targetState}`);
            // Wait for current loop to end?
            // User requirement: "Wait until one animation ends before transitioning"
            // We achieve this by simply NOT forcing a switch now.
            // The 'ended' event handler will check 'this.targetState' and swap if needed.
        } else {
             // Same video file, just update state tracking
             this.currentState = normalizedState;
             this.targetState = null; // Clear pending
        }
    },

    handleVideoEnd() {
        const videoElem = this.activeVideo;
        
        // Check if we have a pending transition
        if (this.targetState) {
            const targetSrc = this.assets[this.targetState] || this.assets['IDLE'];
            const currentSrc = videoElem.getAttribute('src');

            if (currentSrc && !currentSrc.endsWith(targetSrc)) {
                this.swapVideo(targetSrc);
                this.currentState = this.targetState;
                this.targetState = null;
                return;
            }
        }
        
        // No transition, loop current
        videoElem.currentTime = 0;
        videoElem.play().catch(e => console.error("Loop replay failed:", e));
    },

    swapVideo(newSrc) {
        console.log(`[VISUALIZER] Swapping to: ${newSrc}`);
        
        // 1. Prepare Buffer
        this.bufferVideo.src = newSrc;
        this.bufferVideo.load();
        
        // 2. Play Buffer (hidden)
        this.bufferVideo.play().then(() => {
            // 3. Cross-fade
            this.bufferVideo.classList.remove('hidden'); // Fade IN
            this.activeVideo.classList.add('hidden');    // Fade OUT
            
            // 4. Swap Logic (after transition)
            setTimeout(() => {
                // Stop old active
                this.activeVideo.pause();
                this.activeVideo.currentTime = 0;
                
                // Swap references
                const temp = this.activeVideo;
                this.activeVideo = this.bufferVideo;
                this.bufferVideo = temp;
                
                // Re-bind 'ended' listener to new active
                this.activeVideo.onended = () => this.handleVideoEnd();
                this.bufferVideo.onended = null; // Clear old listener
                
            }, 1000); // 1s matches CSS transition
        }).catch(e => console.error("Buffer play failed:", e));
    },

    updateFilters(state) {
        const classes = ['state-idle', 'state-thinking', 'state-speaking', 'state-error'];
        
        // Apply to both to ensure smoothness
        if(this.activeVideo) this.activeVideo.classList.remove(...classes);
        if(this.bufferVideo) this.bufferVideo.classList.remove(...classes);

        const targetClass = `state-${state.toLowerCase()}`;
        if(this.activeVideo) this.activeVideo.classList.add(targetClass);
        if(this.bufferVideo) this.bufferVideo.classList.add(targetClass);
    }
};
