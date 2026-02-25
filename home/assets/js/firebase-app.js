import firebaseConfig from './config.js';

// Initialize Firebase
console.log("[FIREBASE] Initializing with Config:", firebaseConfig.projectId);

let DatabaseInstance = {};

if (typeof firebase === 'undefined') {
    console.error("[FIREBASE] FATAL: Firebase SDK not found! Check script tags in HTML.");
} else {
    try {
        const app = firebase.initializeApp(firebaseConfig);
        const db = app.database();
        const auth = app.auth();

        // Connection Monitoring
        db.ref(".info/connected").on("value", (snap) => {
            if (snap.val() === true) {
                console.log("[FIREBASE] CONNECTION_ESTABLISHED");
                
                // Test Read to check permissions
                db.ref('home_system').once('value')
                    .then(s => console.log("[FIREBASE] TEST_READ_SUCCESS:", s.exists() ? "Data found" : "Node empty"))
                    .catch(e => console.error("[FIREBASE] TEST_READ_FAILED:", e.message));
            } else {
                console.warn("[FIREBASE] CONNECTION_LOST / SEARCHING...");
            }
        });

        DatabaseInstance = {
            // Auth
            login: (email, password) => {
                console.log("[AUTH] ATTEMPTING_LOGIN:", email);
                return auth.signInWithEmailAndPassword(email, password);
            },
            onAuthStateChanged: (callback) => {
                auth.onAuthStateChanged((user) => {
                    console.log("[AUTH] STATE_CHANGED:", user ? `UID: ${user.uid}` : "NO_USER");
                    callback(user);
                });
            },
            logout: () => {
                console.log("[AUTH] LOGOUT_REQUESTED");
                return auth.signOut();
            },

            // Data
            onKeysUpdate: (callback) => {
                db.ref('home_system/config/api_keys').on('value', (s) => {
                    console.log("[DATA] KEYS_UPDATED:", s.val());
                    callback(s.val() || []);
                }, (err) => console.error("[DATA_ERR] KEYS:", err.message));
            },
            onActiveKeyIndexUpdate: (callback) => {
                db.ref('home_system/server_info/active_key_index').on('value', (s) => {
                    console.log("[DATA] KEY_INDEX_UPDATED:", s.val());
                    callback(s.val() || 0);
                }, (err) => console.error("[DATA_ERR] KEY_INDEX:", err.message));
            },
            onServerInfoUpdate: (callback) => {
                db.ref('home_system/server_info').on('value', (s) => {
                    console.log("[DATA] SERVER_INFO_UPDATED:", s.val());
                    callback(s.val() || {});
                }, (err) => console.error("[DATA_ERR] SERVER_INFO:", err.message));
            },
            onNewLog: (callback) => {
                db.ref('home_system/logs').limitToLast(50).on('child_added', (s) => {
                    console.log("[DATA] NEW_LOG_RECEIVED:", s.key);
                    const val = s.val();
                    if (val) {
                        val.id = s.key;
                        callback(val);
                    }
                }, (err) => console.error("[DATA_ERR] LOGS:", err.message));
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
    } catch (e) {
        console.error("[FIREBASE] Initialization Error:", e);
    }
}

export const Database = DatabaseInstance;
