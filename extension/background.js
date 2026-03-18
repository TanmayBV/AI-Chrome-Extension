chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });

    chrome.contextMenus.create({
        id: "askAI",
        title: "Ask AI about selection",
        contexts: ["selection"]
    });
});

chrome.action.onClicked.addListener(async (tab) => {

    const data = await chrome.storage.local.get("enabled");
    const newState = !data.enabled;

    await chrome.storage.local.set({ enabled: newState });

    // ONLY send message (NO injection)
    chrome.tabs.sendMessage(tab.id, {
        action: "toggle",
        enabled: newState
    }).catch(() => {
        console.log("Content script not ready yet");
    });

});

// Right click
chrome.contextMenus.onClicked.addListener((info, tab) => {

    chrome.tabs.sendMessage(tab.id, {
        action: "askAI",
        text: info.selectionText
    });

});
