import firebaseConfig from './config.js';

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.database();
const auth = app.auth();

export const Database = {
    // Auth
    login: (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    },
    onAuthStateChanged: (callback) => {
        auth.onAuthStateChanged(callback);
    },
    logout: () => {
        return auth.signOut();
    },

    // Data
    onKeysUpdate: (callback) => {
        db.ref('home_system/config/api_keys').on('value', (s) => callback(s.val() || []));
    },
    onActiveKeyIndexUpdate: (callback) => {
        db.ref('home_system/server_info/active_key_index').on('value', (s) => callback(s.val() || 0));
    },
    onServerInfoUpdate: (callback) => {
        db.ref('home_system/server_info').on('value', (s) => callback(s.val() || {}));
    },
    onNewLog: (callback) => {
        db.ref('home_system/logs').limitToLast(50).on('child_added', (s) => {
            const val = s.val();
            if (val) {
                val.id = s.key;
                callback(val);
            }
        });
    },
    markRead: (id) => {
        return db.ref('home_system/logs/' + id).update({ read: true });
    },
    setApiKeys: (keys) => {
        return db.ref('home_system/config/api_keys').set(keys);
    },
    sendCommand: (command) => {
        const cmdRef = db.ref('home_system/commands');
        return cmdRef.set(command);
    },
    stopAI: () => {
        return db.ref('home_system/server_info/stop_requested').set(true);
    },
    restartBridge: () => {
        return db.ref('home_system/server_info/restart_requested').set(true);
    }
};
