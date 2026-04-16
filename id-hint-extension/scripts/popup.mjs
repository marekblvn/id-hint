import defaultSettings from "../utils/default-settings.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  assignTabButtonsEventListeners(tabButtons, tabContents);

  Object.keys(defaultSettings).forEach((key) => {
    const el = document.getElementById(key);
    if (el && el.tagName !== "DIV") {
      setSettingValueFromStorage(key, defaultSettings[key]);
    }
  });

  const hintPositionInput = document.getElementById("hint-position");
  hintPositionInput?.addEventListener("change", (event) =>
    handleInputValueChange(event, "hint-position"),
  );

  initColorPicker("hint-tag-color", defaultSettings["hint-tag-color"]);
  initColorPicker("hint-id-color", defaultSettings["hint-id-color"]);
  initColorPicker(
    "hint-background-color",
    defaultSettings["hint-background-color"],
  );
});

const initColorPicker = async (id, fallback) => {
  const container = document.getElementById(id);
  if (!container) return;
  const stored = await chrome.storage.sync.get(id);
  const initialColor = stored[id] ?? fallback;
  const picker = new window.iro.ColorPicker(`#${id}`, {
    color: initialColor,
    width: 120,
    boxHeight: 80,
    layoutDirection: "vertical",
    layout: [
      { component: iro.ui.Box },
      { component: iro.ui.Slider, options: { sliderType: "hue" } },
      { component: iro.ui.Slider, options: { sliderType: "alpha" } },
    ],
  });
  picker.on("input:end", async (color) => {
    await chrome.storage.sync.set({ [id]: color.hex8String });
  });
};

/**
 * @param {NodeListOf<Element>} tabButtons
 * @param {NodeListOf<Element>} tabContents
 */
const assignTabButtonsEventListeners = (tabButtons, tabContents) => {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-targetId");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((cnt) => cnt.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });
};

/**
 * @param {Event} event
 * @param {string} inputId
 */
const handleInputValueChange = async (event, inputId) => {
  const value = event.target.value;
  if (value) {
    await chrome.storage.sync.set({ [inputId]: value });
  }
};

/**
 * @param {string} inputId
 * @param {string} fallbackValue
 */
const setSettingValueFromStorage = async (inputId, fallbackValue) => {
  const inputElement = document.getElementById(inputId);
  const storedSettingValue = await chrome.storage.sync.get(inputId);
  if (inputElement) {
    inputElement.value = storedSettingValue[inputId] ?? fallbackValue;
  }
};
