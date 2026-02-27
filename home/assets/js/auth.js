import { dbService } from './firebase-service.js';

const Auth = {
    // HARDCODED CREDENTIALS (as per user requirement)
    adminEmail: "successadhikari1234@gmail.com",
    
    elements: {
        overlay: document.getElementById('login-overlay'),
        passInput: document.getElementById('login-pass'),
        btn: document.getElementById('btn-login'),
        errorMsg: document.getElementById('login-error')
    },

    init() {
        // Bind UI events
        if (this.elements.btn) {
            this.elements.btn.onclick = () => this.attemptLogin();
        }
        
        if (this.elements.passInput) {
            this.elements.passInput.onkeypress = (e) => {
                if (e.key === 'Enter') this.attemptLogin();
            };
        }

        document.getElementById('btn-logout-main').onclick = () => {
            dbService.logout();
        };

        // Listen for auth state changes
        dbService.onAuthStateChanged((user) => {
            this.handleAuthState(user);
        });
    },

    attemptLogin() {
        const pass = this.elements.passInput.value.trim();
        if (!pass) return;

        this.setLoading(true);

        dbService.login(this.adminEmail, pass)
            .then((userCredential) => {
                console.log("[AUTH] SUCCESS:", userCredential.user.uid);
                // State listener will handle the transition
            })
            .catch((error) => {
                console.error("[AUTH] FAIL:", error);
                this.showError("INVALID PASSCODE");
                this.setLoading(false);
            });
    },

    handleAuthState(user) {
        if (user) {
            // Optional: Check UID if strictly required
            // if (user.uid !== '3u6ylRq3pPe8FnAKilcJmADaooR2') { ... }
            
            console.log("[AUTH] SESSION_ACTIVE");
            this.elements.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.elements.overlay.style.display = 'none';
            }, 500);

            // Signal main app to start
            document.dispatchEvent(new CustomEvent('auth:success', { detail: user }));
        } else {
            console.log("[AUTH] SESSION_ENDED");
            this.elements.overlay.style.display = 'flex';
            this.elements.overlay.classList.remove('fade-out');
            this.elements.passInput.value = '';
            this.setLoading(false);
            
            // Signal main app to stop
            document.dispatchEvent(new CustomEvent('auth:logout'));
        }
    },

    setLoading(isLoading) {
        if (isLoading) {
            this.elements.btn.textContent = 'VERIFYING...';
            this.elements.btn.disabled = true;
            this.elements.errorMsg.style.display = 'none';
        } else {
            this.elements.btn.textContent = 'INITIALIZE UPLINK';
            this.elements.btn.disabled = false;
        }
    },

    showError(msg) {
        this.elements.errorMsg.textContent = `> ERROR: ${msg}`;
        this.elements.errorMsg.style.display = 'block';
        
        // Shake animation
        this.elements.passInput.classList.add('shake');
        setTimeout(() => this.elements.passInput.classList.remove('shake'), 500);
    }
};

export default Auth;
