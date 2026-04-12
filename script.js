document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const hashOutput = document.getElementById("hash-output");
    const charLimitInput = document.getElementById("char-limit");
    const copyButton = document.getElementById("copy-btn");
    const statusMessage = document.getElementById("status-message");

    let fullHash = "";

    const setStatus = (message, type = "") => {
        statusMessage.textContent = message;
        statusMessage.className = "status-message" + (type ? ` ${type}` : "");
    };

    const refreshDisplay = () => {
        const limit = Math.max(1, Math.min(64, parseInt(charLimitInput.value, 10) || 64));
        charLimitInput.value = limit;
        hashOutput.value = fullHash ? fullHash.substring(0, limit) : "";
    };

    const generateHash = (file) => {
        if (!file || !file.type.startsWith("image/")) {
            setStatus("Please choose a valid image file.", "error");
            return;
        }

        setStatus(`Generating SHA-256 hash for ${file.name}...`, "working");

        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                const arrayBuffer = event.target.result;
                const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                fullHash = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
                refreshDisplay();
                setStatus(`Hash generated for ${file.name}.`, "success");
            } catch (error) {
                console.error(error);
                fullHash = "";
                refreshDisplay();
                setStatus("Something went wrong while generating the hash.", "error");
            }
        };

        reader.onerror = function () {
            setStatus("The selected file could not be read.", "error");
        };

        reader.readAsArrayBuffer(file);
    };

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("dragover");
        const file = event.dataTransfer.files[0];
        if (file) {
            generateHash(file);
        }
    });

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            generateHash(file);
        }
    });

    charLimitInput.addEventListener("input", refreshDisplay);

    copyButton.addEventListener("click", async function () {
        if (!hashOutput.value) {
            setStatus("Generate a hash first, then copy it.", "error");
            return;
        }

        try {
            await navigator.clipboard.writeText(hashOutput.value);
            setStatus("Hash copied to clipboard.", "success");
        } catch (error) {
            console.error(error);
            hashOutput.select();
            document.execCommand("copy");
            setStatus("Hash copied to clipboard.", "success");
        }
    });

    setStatus("Ready. Drop in an image to begin.");
});
