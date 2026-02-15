import { Database } from './firebase-app.js';
import { UI } from './ui.js';

let state = {
    apiKeys: [],
    activeKeyIndex: 0,
    isInitialized: false,
    adminEmail: "home@success.ai" // Updated to match user
};

// --- AUTH LOGIC ---

async function handleLogin() {
    const pass = document.getElementById('login_pass').value;
    const errorEl = document.getElementById('login_error');
    
    if (!pass) return;
    errorEl.textContent = "> ATTEMPTING_DECRYPTION...";

    try {
        await Database.login(state.adminEmail, pass);
    } catch (e) {
        errorEl.textContent = "> ERROR: INVALID_ACCESS_KEY";
        console.error(e);
    }
}

function handleLogout() {
    Database.logout().then(() => {
        location.reload();
    });
}

// --- APP INITIALIZATION ---

function initDashboard() {
    if (state.isInitialized) return;
    state.isInitialized = true;

    document.body.classList.remove('locked');
    document.getElementById('login_overlay').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';

    // Data Listeners
    Database.onKeysUpdate((keys) => {
        state.apiKeys = keys;
        UI.renderKeys(state.apiKeys, state.activeKeyIndex, deleteKey);
    });

    Database.onActiveKeyIndexUpdate((index) => {
        state.activeKeyIndex = index;
        UI.updateActiveKeyIndex(index);
        UI.renderKeys(state.apiKeys, state.activeKeyIndex, deleteKey);
    });

    Database.onServerInfoUpdate((info) => {
        UI.updateServerInfo(info);
        UI.renderKeys(state.apiKeys, state.activeKeyIndex, deleteKey);
    });

    Database.onNewLog((log) => {
        UI.appendLog(log, (id) => {
            if (id) Database.markRead(id).catch(console.error);
        });
    });

    // Event Listeners
    document.getElementById('btn_add_key').onclick = addKey;
    document.getElementById('btn_execute_ai').onclick = executeAI;
    document.getElementById('btn_execute_speak').onclick = executeSpeak;
    document.getElementById('btn_restart_bridge').onclick = restartBridge;
    document.getElementById('btn_logout').onclick = handleLogout;
    
    const btnClear = document.getElementById('btn_clear_logs');
    if (btnClear) btnClear.onclick = () => UI.clearLogs();

    // Enter Key Listeners
    document.getElementById('new_key').onkeypress = (e) => { if (e.key === 'Enter') addKey(); };
    document.getElementById('ai_in').onkeypress = (e) => { if (e.key === 'Enter') executeAI(); };
    document.getElementById('tts_in').onkeypress = (e) => { if (e.key === 'Enter') executeSpeak(); };
}

// --- ACTIONS ---

async function addKey() {
    const k = document.getElementById('new_key').value.trim();
    if (!k) return;
    const newKeys = [...state.apiKeys, k];
    try {
        await Database.setApiKeys(newKeys);
        document.getElementById('new_key').value = "";
    } catch (e) {
        console.error("Failed to add key:", e);
    }
}

async function deleteKey(idx) {
    if (!confirm("DELETE KEY?")) return;
    const newKeys = state.apiKeys.filter((_, i) => i !== idx);
    try {
        await Database.setApiKeys(newKeys);
    } catch (e) {
        console.error("Failed to delete key:", e);
    }
}

async function executeAI() {
    const p = document.getElementById('ai_in').value;
    if (!p) return;
    try {
        await Database.sendCommand({ type: 'ai', prompt: p });
        document.getElementById('ai_in').value = "";
    } catch (e) {
        console.error("AI Command failed:", e);
    }
}

async function executeSpeak() {
    const t = document.getElementById('tts_in').value;
    if (!t) return;
    try {
        await Database.sendCommand({ type: 'speak', text: t });
        document.getElementById('tts_in').value = "";
    } catch (e) {
        console.error("Speak Command failed:", e);
    }
}

function restartBridge() {
    if (confirm("CONFIRM SYSTEM REBOOT?")) {
        Database.restartBridge().catch(e => console.error("Restart failed:", e));
    }
}

// --- ENTRY POINT ---

Database.onAuthStateChanged((user) => {
    if (user && user.uid === 'HePUPBxYTMWtIF0LnH6izvFPhPh1') {
        initDashboard();
    } else {
        document.body.classList.add('locked');
        document.getElementById('login_overlay').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        
        if (user) {
            document.getElementById('login_error').textContent = "> UNAUTHORIZED_UID: " + user.uid;
        }
    }
});

document.getElementById('btn_login').onclick = handleLogin;
document.getElementById('login_pass').onkeypress = (e) => { if (e.key === 'Enter') handleLogin(); };
