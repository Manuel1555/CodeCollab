// ===== CodeCollab Editor =====

(function () {
  const codeEditor = document.getElementById("codeEditor");
  const lineNumbers = document.getElementById("lineNumbers");
  const cursorPos = document.getElementById("cursorPos");
  const miniChatInput = document.getElementById("miniChatInput");
  const miniChatSend = document.getElementById("miniChatSend");
  const miniChatMessages = document.getElementById("miniChatMessages");
  const fileTree = document.getElementById("fileTree");
  const newFileBtn = document.getElementById("newFileBtn");

  // --- File contents store ---
  const files = {
    "index.js": codeEditor.value,
    "styles.css": `/* CodeCollab Styles */\n\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 0;\n  background: #0f172a;\n  color: #f1f5f9;\n}\n\n.container {\n  max-width: 960px;\n  margin: 0 auto;\n  padding: 2rem;\n}`,
    "readme.md": `# CodeCollab\n\nA collaborative code editor with real-time chat.\n\n## Features\n- Live editing with syntax highlighting\n- Built-in team chat\n- Multiple file support\n- Dark theme\n\n## Getting Started\nOpen index.html in your browser to get started.`,
  };

  let currentFile = "index.js";

  // --- Line Numbers ---
  function updateLineNumbers() {
    const lines = codeEditor.value.split("\n").length;
    const nums = [];
    for (let i = 1; i <= lines; i++) {
      nums.push(i);
    }
    lineNumbers.textContent = nums.join("\n");
  }

  // --- Cursor Position ---
  function updateCursorPos() {
    const text = codeEditor.value.substring(0, codeEditor.selectionStart);
    const lines = text.split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    cursorPos.textContent = "Ln " + line + ", Col " + col;
  }

  // --- Tab Key Support ---
  function handleTab(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.value =
        codeEditor.value.substring(0, start) +
        "  " +
        codeEditor.value.substring(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
      updateLineNumbers();
    }
  }

  // --- File Switching ---
  function switchFile(fileName) {
    // Save current file
    files[currentFile] = codeEditor.value;
    currentFile = fileName;

    // Load new file
    codeEditor.value = files[fileName] || "";
    updateLineNumbers();
    updateCursorPos();

    // Update active states
    document.querySelectorAll(".file-item").forEach(function (item) {
      item.classList.toggle("active", item.dataset.file === fileName);
    });

    // Update tab
    const tabsContainer = document.querySelector(".editor-tabs");
    const existingTab = tabsContainer.querySelector(
      '[data-file="' + fileName + '"]'
    );
    if (!existingTab) {
      const tab = document.createElement("div");
      tab.className = "tab active";
      tab.dataset.file = fileName;
      tab.innerHTML =
        fileName + ' <span class="tab-close">&times;</span>';
      tabsContainer.appendChild(tab);
    }

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.dataset.file === fileName);
    });
  }

  // --- New File ---
  function createNewFile() {
    const name = prompt("Enter file name:");
    if (name && !files[name]) {
      files[name] = "";

      const li = document.createElement("li");
      li.className = "file-item";
      li.dataset.file = name;
      li.innerHTML = '<span class="file-icon">&#128196;</span> ' + name;
      fileTree.appendChild(li);

      switchFile(name);
    }
  }

  // --- Mini Chat ---
  function sendMiniChat() {
    const text = miniChatInput.value.trim();
    if (!text) return;

    const msg = document.createElement("div");
    msg.className = "mini-msg";
    msg.innerHTML =
      '<strong class="msg-user" style="color: #6366f1;">You</strong>' +
      "<span>" +
      escapeHtml(text) +
      "</span>";
    miniChatMessages.appendChild(msg);
    miniChatMessages.scrollTop = miniChatMessages.scrollHeight;
    miniChatInput.value = "";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Event Listeners ---
  codeEditor.addEventListener("input", function () {
    updateLineNumbers();
    files[currentFile] = codeEditor.value;
  });

  codeEditor.addEventListener("click", updateCursorPos);
  codeEditor.addEventListener("keyup", updateCursorPos);
  codeEditor.addEventListener("keydown", handleTab);

  fileTree.addEventListener("click", function (e) {
    var item = e.target.closest(".file-item");
    if (item) {
      switchFile(item.dataset.file);
    }
  });

  document.querySelector(".editor-tabs").addEventListener("click", function (e) {
    if (e.target.classList.contains("tab-close")) {
      var tab = e.target.parentElement;
      var fileName = tab.dataset.file;
      tab.remove();
      if (fileName === currentFile) {
        var remainingTab = document.querySelector(".tab");
        if (remainingTab) {
          switchFile(remainingTab.dataset.file);
        }
      }
      return;
    }

    var tab = e.target.closest(".tab");
    if (tab) {
      switchFile(tab.dataset.file);
    }
  });

  newFileBtn.addEventListener("click", createNewFile);

  miniChatSend.addEventListener("click", sendMiniChat);
  miniChatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMiniChat();
    }
  });

  // --- Initialize ---
  updateLineNumbers();
  updateCursorPos();
})();
