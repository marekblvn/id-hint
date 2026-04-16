if (!globalThis.__IdHintInjected) {
  globalThis.__IdHintInjected = true;

  const display = document.createElement("div");
  const idSpan = document.createElement("span");
  const tagSpan = document.createElement("span");

  chrome.storage.sync
    .get([
      "hint-position",
      "hint-background-color",
      "hint-tag-color",
      "hint-id-color",
    ])
    .then((res) => {
      if (res["hint-position"]) {
        display.classList.remove([
          "top-right",
          "top-left",
          "bottom-right",
          "bottom-left",
        ]);
        display.classList.add([res["hint-position"]]);
      }
      if (res["hint-background-color"]) {
        display.style["backgroundColor"] = res["hint-background-color"];
      }
      if (res["hint-tag-color"]) {
        tagSpan.style["color"] = res["hint-tag-color"];
      }
      if (res["hint-id-color"]) {
        idSpan.style["color"] = res["hint-id-color"];
      }
    });

  display.id = "id-hint-hint";
  tagSpan.id = "id-hint-hint-tag";
  idSpan.id = "id-hint-hint-id";
  idSpan.textContent = "No element";
  tagSpan.textContent = "(no id)";

  display.append(tagSpan);
  display.append(idSpan);
  document.body.appendChild(display);

  let currentTag = "";
  let currentId = "";

  const mouseoverHandler = (e) => {
    const target = e.target;
    currentTag = target.tagName.toLowerCase() || "";
    currentId = target.id || "";
    tagSpan.textContent = currentTag ? `${currentTag}` : "No element";
    idSpan.textContent = currentId ? `#${currentId}` : "(no id)";
  };

  // Make this a command that emits - add keyboard shortcut to manifest
  const keydownHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      if (currentId) {
        navigator.clipboard
          .writeText(currentId)
          .then(() => {
            tagSpan.textContent = "";
            idSpan.textContent = `Copied: #${currentId}`;
            setTimeout(() => {
              tagSpan.textContent = currentTag;
              idSpan.textContent = `#${currentId}`;
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

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") {
      if (changes["hint-position"]) {
        const oldValue = changes["hint-position"].oldValue;
        const newValue = changes["hint-position"].newValue;
        if (oldValue !== newValue) {
          display.classList.remove(oldValue);
          display.classList.add(newValue);
        }
      }
      if (changes["hint-tag-color"]) {
        const newValue = changes["hint-tag-color"].newValue;
        tagSpan.style["color"] = newValue;
      }
      if (changes["hint-id-color"]) {
        const newValue = changes["hint-id-color"].newValue;
        idSpan.style["color"] = newValue;
      }
      if (changes["hint-background-color"]) {
        const newValue = changes["hint-background-color"].newValue;
        display.style["backgroundColor"] = newValue;
      }
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "deactivate") {
      document.removeEventListener("mouseover", mouseoverHandler);
      document.removeEventListener("keydown", keydownHandler);
      display.remove();
      globalThis.__IdHintInjected = false;
    }
  });
}
