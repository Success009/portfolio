import firebaseConfig from './config.js';

// Initialize Firebase (Assuming firebase is already loaded globally or via script tag in HTML)
// Since we are using standard script tags for firebase in the original HTML, 
// we'll expect firebase to be globally available if we don't use a bundler.
// However, to be "robust", let's handle initialization.

const app = firebase.initializeApp(firebaseConfig);
const db = app.database();

export const Database = {
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
        return db.ref('home_system/commands').set(command);
    },
    restartBridge: () => {
        return db.ref('home_system/control/restart').set(true);
    }
};
