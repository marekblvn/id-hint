const tabStates = new Map();

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  console.log("clicked");
  const tabId = tab.id;
  const isActive = tabStates.get(tabId) || false;
  if (!isActive) {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ["styles/style.css"],
      });
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["scripts/content.js"],
      });
      tabStates.set(tabId, true);
      await chrome.action.setBadgeText({ tabId, text: "ON" });
      await chrome.action.setBadgeBackgroundColor({
        tabId,
        color: "#4CBB17",
      });
    } catch (error) {
      console.error("Enable failed:", error);
    }
  } else {
    chrome.tabs.sendMessage(tabId, { action: "deactivate" });
    tabStates.set(tabId, false);
    await chrome.action.setBadgeText({ tabId, text: "" });
  }
});
