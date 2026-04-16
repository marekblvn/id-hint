const tabStates = new Map();

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "toggle-extension") {
    const tabId = tab.id;
    const notActive = !tabStates.get(tabId);
    const [currentTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const focusedTab = tabId === currentTab.id;
    if (!focusedTab) {
      return;
    }
    if (notActive) {
      try {
        chrome.scripting.insertCSS({
          target: { tabId },
          files: ["styles/hint.css"],
        });
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["scripts/content.mjs"],
        });
        chrome.tabs.sendMessage(tabId, { action: "activate" });
        tabStates.set(tabId, true);
        await chrome.action.setBadgeText({ tabId, text: "ON" });
        await chrome.action.setBadgeBackgroundColor({
          tabId,
          color: "#4CBB17",
        });
      } catch (error) {
        console.warn(
          "Could not activate extension due to:",
          error.message ?? error,
        );
      }
    } else {
      try {
        chrome.tabs.sendMessage(tabId, { action: "deactivate" });
        tabStates.set(tabId, false);
        await chrome.action.setBadgeText({ tabId, text: "" });
      } catch (error) {
        console.warn(
          "Could not deactivate extension due to:",
          error.message ?? error,
        );
      }
    }
  }
});
