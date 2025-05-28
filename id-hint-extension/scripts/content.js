if (!window.__IdHintInjected) {
  window.__InHintInjected = true;

  const display = document.createElement("div");
  const idDisplay = document.createElement("div");
  const tagDisplay = document.createElement("div");

  const applySettings = () => chrome.storage.sync.get(null, (items) => {
    if (items.hintPosition) {
      switch (items.hintPosition) {
        case "bottom-left":
          display.style.bottom = "10px";
          display.style.left = "10px";
          display.style.right = "auto";
          display.style.top = "auto";
          break;
          case "bottom-right":
            display.style.bottom = "10px";
            display.style.right = "10px";
            display.style.left = "auto";
            display.style.top = "auto";
          break;
        case "top-left":
          display.style.top = "10px";
          display.style.left = "10px";
          display.style.right = "auto";
          display.style.bottom = "auto";
          break;
        case "top-right":
          display.style.top = "10px";
          display.style.right = "10px";
          display.style.left = "auto";
          display.style.bottom = "auto";
      }
    } else {
      display.style.bottom = "10px";
      display.style.left = "10px";
      display.style.right = "auto";
      display.style.top = "auto";
    }
    if (items.hintBgColor) {
      display.style.backgroundColor = items.hintBgColor;
    } else {
      display.style.backgroundColor = "#ffffffb3";
    }
    if (items.hintTagColor) {
      tagDisplay.style.color = items.hintTagColor;
    } else {
      tagDisplay.style.color = "#8d0000";
    }
    if (items.hintIdColor) {
      display.style.color = items.hintIdColor;
    } else {
      display.style.color = "#191919";
    }
  });

  display.id = "id-hint-display";
  tagDisplay.id = "tag-display";

  applySettings();

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

  chrome.storage.onChanged.addListener((changes, areaName) => applySettings());

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "deactivate") {
      document.removeEventListener("mouseover", mouseoverHandler);
      document.removeEventListener("keydown", keydownHandler);
      display.remove();
      window.__IdHintInjected = false;
    }
  });
}
