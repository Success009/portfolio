import firebaseConfig from './config.js';

class FirebaseService {
    constructor() {
        this.db = null;
        this.auth = null;
        this.connected = false;
        this.init();
    }

    init() {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK missing");
            return;
        }
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        this.auth = firebase.auth();
        
        // Monitor Connection
        this.db.ref(".info/connected").on("value", snap => {
            this.connected = snap.val() === true;
            document.dispatchEvent(new CustomEvent('sys:connection', { detail: { online: this.connected } }));
        });
    }

    // --- AUTHENTICATION ---
    
    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    onAuthStateChanged(callback) {
        this.auth.onAuthStateChanged(user => callback(user));
    }

    // --- DATA STREAMS ---
    
    subscribeToStats(cb) {
        this.db.ref('home_system/server_info').on('value', snap => cb(snap.val()));
    }

    subscribeToLogs(cb) {
        this.db.ref('home_system/logs').limitToLast(30).on('child_added', snap => {
            cb({ id: snap.key, ...snap.val() });
        });
    }

    subscribeToKeys(cb) {
        this.db.ref('home_system/config/api_keys').on('value', snap => cb(snap.val()));
    }

    // --- ACTIONS ---

    sendCommand(cmdText) {
        if (!cmdText) return;
        const payload = {
            command: cmdText, 
            type: 'user_input',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        return this.db.ref('home_system/commands').push(payload);
    }

    restartBridge() {
        return this.db.ref('home_system/commands').push({
            type: 'system_restart',
            mode: 'bridge',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }

    addKey(key) {
        const ref = this.db.ref('home_system/config/api_keys');
        ref.once('value', snap => {
            const current = snap.val() || [];
            current.push(key);
            ref.set(current);
        });
    }

    removeKey(index) {
        const ref = this.db.ref('home_system/config/api_keys');
        ref.once('value', snap => {
            const current = snap.val() || [];
            if (index >= 0 && index < current.length) {
                current.splice(index, 1);
                ref.set(current);
            }
        });
    }
}

export const dbService = new FirebaseService();
