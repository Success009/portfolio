import { Database } from './firebase-app.js';
import { UI } from './ui.js';

let state = {
    apiKeys: [],
    activeKeyIndex: 0
};

// --- INITIALIZATION ---

function init() {
    // Listeners
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

    // Event Listeners for Buttons
    document.getElementById('btn_add_key').onclick = addKey;
    document.getElementById('btn_execute_ai').onclick = executeAI;
    document.getElementById('btn_execute_speak').onclick = executeSpeak;
    document.getElementById('btn_restart_bridge').onclick = restartBridge;
    UI.elements.btnClearLogs.onclick = () => UI.clearLogs();

    // Enter Key Listeners
    UI.elements.newKeyInput.onkeypress = (e) => { if (e.key === 'Enter') addKey(); };
    UI.elements.aiInput.onkeypress = (e) => { if (e.key === 'Enter') executeAI(); };
    UI.elements.ttsInput.onkeypress = (e) => { if (e.key === 'Enter') executeSpeak(); };
}

// --- ACTIONS ---

async function addKey() {
    const k = UI.elements.newKeyInput.value.trim();
    if (!k) return;
    const newKeys = [...state.apiKeys, k];
    try {
        await Database.setApiKeys(newKeys);
        UI.elements.newKeyInput.value = "";
    } catch (e) {
        console.error("Failed to add key:", e);
        alert("ERROR UPDATING KEYS");
    }
}

async function deleteKey(idx) {
    if (!confirm("DELETE KEY?")) return;
    const newKeys = state.apiKeys.filter((_, i) => i !== idx);
    try {
        await Database.setApiKeys(newKeys);
    } catch (e) {
        console.error("Failed to delete key:", e);
        alert("ERROR DELETING KEY");
    }
}

async function executeAI() {
    const p = UI.elements.aiInput.value;
    if (!p) return;
    try {
        await Database.sendCommand({ type: 'ai', prompt: p });
        UI.elements.aiInput.value = "";
    } catch (e) {
        console.error("AI Command failed:", e);
    }
}

async function executeSpeak() {
    const t = UI.elements.ttsInput.value;
    if (!t) return;
    try {
        await Database.sendCommand({ type: 'speak', text: t });
        UI.elements.ttsInput.value = "";
    } catch (e) {
        console.error("Speak Command failed:", e);
    }
}

function restartBridge() {
    if (confirm("CONFIRM KERNEL REBOOT?")) {
        Database.restartBridge().catch(e => console.error("Restart failed:", e));
    }
}

// Start the app
init();
