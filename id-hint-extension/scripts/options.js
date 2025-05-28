const saveOptions = () => {
    const hintPosition = document.getElementById("hint-position-select").value;
    const hintBgColor = document.getElementById("hint-bg-color-input").value;
    const hintTagColor = document.getElementById("hint-tag-color-input").value;
    const hintIdColor = document.getElementById("hint-id-color-input").value;
    console.log(
        {hintPosition, hintBgColor, hintTagColor, hintIdColor}
    );
    chrome.storage.sync.set(
        {hintPosition, hintBgColor, hintTagColor, hintIdColor}, () => {
            const status = document.getElementById("status");
            status.textContent = "Settings saved.";
            setTimeout(() => {
                status.textContent = "";
            }, 750);
        }
    );
}

const restoreOptions = () => {
    chrom.storage.sync.get(null, (items) => {
        document.getElementById("hint-position-select").value = items.hintPosition;
        document.getElementById("hint-bg-color-input").value = items.hintBgColor;
        document.getElementById("hint-tag-color-input").value = items.hintTagColor;
        document.getElementById("hint-id-color-input").value = items.hintIdColor;
    });
}

document.addEventListener("DOMContentLoaded", () => {});
document.getElementById("save-button").addEventListener("click", saveOptions);