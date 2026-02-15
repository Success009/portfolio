import { Database } from './firebase-app.js';
import { UI } from './ui.js';

let state = {
    apiKeys: [],
    activeKeyIndex: 0,
    isInitialized: false,
    adminEmail: "successadhikari1234@gmail.com"
};

// --- AUTH LOGIC ---

async function handleLogin() {
    const loginPass = document.getElementById('login_pass');
    const loginError = document.getElementById('login_error');
    if (!loginPass) return;

    const pass = loginPass.value;
    if (!pass) return;
    
    if (loginError) loginError.textContent = "> ATTEMPTING_DECRYPTION...";

    try {
        await Database.login(state.adminEmail, pass);
    } catch (e) {
        if (loginError) loginError.textContent = "> ERROR: INVALID_ACCESS_KEY";
        console.error(e);
    }
}

function handleLogout() {
    Database.logout().then(() => {
        window.location.href = 'index.html';
    });
}

// --- APP INITIALIZATION ---

function initDashboard() {
    if (state.isInitialized) return;
    
    const dashboardEl = document.getElementById('dashboard');
    if (!dashboardEl) return; 
    
    state.isInitialized = true;
    dashboardEl.style.display = 'flex';

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
        UI.renderKeys(state.apiKeys, info.current_key_idx, deleteKey);
    });

    Database.onNewLog((log) => {
        UI.appendLog(log, (id) => {
            if (id) Database.markRead(id).catch(console.error);
        });
    });

    // Event Listeners
    const btnAddKey = document.getElementById('btn_add_key');
    if (btnAddKey) btnAddKey.onclick = addKey;

    const btnExecuteAi = document.getElementById('btn_execute_ai');
    if (btnExecuteAi) btnExecuteAi.onclick = executeAI;

    const btnRestartBridge = document.getElementById('btn_restart_bridge');
    if (btnRestartBridge) btnRestartBridge.onclick = restartBridge;

    const btnTerminate = document.getElementById('btn_terminate');
    if (btnTerminate) btnTerminate.onclick = () => {
        Database.stopAI().catch(e => console.error("Termination failed:", e));
    };

    const btnLogout = document.getElementById('btn_logout');
    if (btnLogout) btnLogout.onclick = handleLogout;
    
    const btnClear = document.getElementById('btn_clear_logs');
    if (btnClear) btnClear.onclick = () => UI.clearLogs();

    // Key Listeners
    const newKeyInput = document.getElementById('new_key');
    if (newKeyInput) newKeyInput.onkeypress = (e) => { if (e.key === 'Enter') addKey(); };

    const aiInput = document.getElementById('ai_in');
    if (aiInput) {
        aiInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                if (e.ctrlKey) {
                    // Let it add a newline (default behavior)
                } else {
                    e.preventDefault();
                    executeAI();
                }
            }
        };
        aiInput.oninput = () => {
            aiInput.style.height = 'auto';
            aiInput.style.height = Math.min(aiInput.scrollHeight, 200) + 'px';
        };
    }
}

// --- ACTIONS ---

async function addKey() {
    const input = document.getElementById('new_key');
    if (!input) return;
    const k = input.value.trim();
    if (!k) return;
    const newKeys = [...state.apiKeys, k];
    try {
        await Database.setApiKeys(newKeys);
        input.value = "";
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
    const input = document.getElementById('ai_in');
    if (!input) return;
    const p = input.value.trim();
    if (!p) return;

    try {
        if (p.startsWith('!')) {
            // Shell Command
            const cmd = p.substring(1).trim();
            await Database.sendCommand({ type: 'shell', command: cmd });
        } else if (p.startsWith('.')) {
            // Direct Speech
            const msg = p.substring(1).trim();
            await Database.sendCommand({ type: 'speak', text: msg });
        } else {
            // AI Reasoning
            await Database.sendCommand({ type: 'ai', prompt: p });
        }
        input.value = "";
        input.style.height = 'auto';
    } catch (e) {
        console.error("Command failed:", e);
    }
}

function restartBridge() {
    if (confirm("CONFIRM SYSTEM REBOOT?")) {
        Database.restartBridge().catch(e => console.error("Restart failed:", e));
    }
}

// --- ENTRY POINT ---

Database.onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('index.html') || path.endsWith('/') || path === '';
    const isDashboardPage = path.endsWith('dashboard.html');

    if (user && user.uid === '3u6ylRq3pPe8FnAKilcJmADaooR2') {
        if (isLoginPage) {
            window.location.href = 'dashboard.html';
        } else if (isDashboardPage) {
            initDashboard();
        }
    } else {
        if (isDashboardPage) {
            window.location.href = 'index.html';
        }
        
        if (user && isLoginPage) {
            const errorEl = document.getElementById('login_error');
            if (errorEl) errorEl.textContent = "> UNAUTHORIZED_UID: " + user.uid;
        }
    }
});

const btnLogin = document.getElementById('btn_login');
if (btnLogin) btnLogin.onclick = handleLogin;

const loginPass = document.getElementById('login_pass');
if (loginPass) loginPass.onkeypress = (e) => { if (e.key === 'Enter') handleLogin(); };

