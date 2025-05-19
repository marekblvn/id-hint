if (!window.__IdHintInjected) {
  window.__InHintInjected = true;

  const display = document.createElement("div");
  const idDisplay = document.createElement("div");
  const tagDisplay = document.createElement("div");
  display.id = "id-hint-display";
  tagDisplay.id = "tag-display";
  idDisplay.textContent = "";
  tagDisplay.textContent = "";
  display.append(tagDisplay);
  display.append(idDisplay);
  document.body.appendChild(display);

  let currentTag = "";
  let currentId = "";

  const mouseoverHandler = (e) => {
    const target = e.target;
    currentTag = target.tagName.toLowerCase() || "";
    currentId = target.id || "";
    tagDisplay.textContent = currentTag ? `${currentTag}` : "No element";
    idDisplay.textContent = currentId ? `#${currentId}` : "(no id)";
  };

  const keydownHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      if (currentId) {
        navigator.clipboard
          .writeText(currentId)
          .then(() => {
            tagDisplay.textContent = "";
            idDisplay.textContent = `Copied: #${currentId}`;
            setTimeout(() => {
              tagDisplay.textContent = currentTag;
              idDisplay.textContent = `#${currentId}`;
            }, 1000);
          })
          .catch((err) => {
            console.error("Clipboard error:", err);
          });
      }
    }
  };

  document.addEventListener("mouseover", mouseoverHandler);
  document.addEventListener("keydown", keydownHandler);

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "deactivate") {
      document.removeEventListener("mouseover", mouseoverHandler);
      document.removeEventListener("keydown", keydownHandler);
      display.remove();
      window.__IdHintInjected = false;
    }
  });
}
