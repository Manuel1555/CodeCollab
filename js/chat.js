// ===== CodeCollab Chat =====

(function () {
  var chatInput = document.getElementById("chatInput");
  var chatSendBtn = document.getElementById("chatSendBtn");
  var chatMessages = document.getElementById("chatMessages");
  var channelItems = document.querySelectorAll(".channel");
  var chatHeader = document.querySelector(".chat-header h2");
  var channelDesc = document.querySelector(".channel-desc");

  var currentChannel = "general";

  var channelDescriptions = {
    general: "Talk about anything related to the project",
    frontend: "UI components, CSS, and frontend architecture",
    backend: "APIs, databases, and server-side logic",
    random: "Off-topic conversations and fun stuff",
  };

  // --- Auto-resize textarea ---
  function autoResize() {
    chatInput.style.height = "auto";
    var maxHeight = 120;
    chatInput.style.height = Math.min(chatInput.scrollHeight, maxHeight) + "px";
  }

  // --- Send Message ---
  function sendMessage() {
    var text = chatInput.value.trim();
    if (!text) return;

    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    var timeStr =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;

    var isCodeBlock = text.startsWith("```") && text.endsWith("```");
    var messageHtml = "";

    if (isCodeBlock) {
      var code = text.slice(3, -3).trim();
      messageHtml =
        '<div class="msg-code-block"><pre><code>' +
        escapeHtml(code) +
        "</code></pre></div>";
    } else {
      messageHtml = "<p>" + escapeHtml(text) + "</p>";
    }

    var msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.innerHTML =
      '<div class="msg-avatar" style="background-color: #6366f1;">Y</div>' +
      '<div class="msg-content">' +
      '<div class="msg-header">' +
      "<strong>You</strong>" +
      '<span class="msg-time">' +
      timeStr +
      "</span>" +
      "</div>" +
      messageHtml +
      "</div>";

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";
    chatInput.style.height = "auto";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Switch Channel ---
  function switchChannel(channelName) {
    currentChannel = channelName;

    channelItems.forEach(function (ch) {
      ch.classList.toggle("active", ch.dataset.channel === channelName);
    });

    chatHeader.innerHTML =
      '<span class="channel-hash">#</span> ' + channelName;
    channelDesc.textContent =
      channelDescriptions[channelName] || "Channel discussion";
    chatInput.placeholder = "Message #" + channelName + "...";

    // Clear messages for demo (in a real app, load channel history)
    if (channelName !== "general") {
      chatMessages.innerHTML =
        '<div class="message">' +
        '<div class="msg-avatar" style="background-color: #6366f1;">Y</div>' +
        '<div class="msg-content">' +
        '<div class="msg-header"><strong>You</strong><span class="msg-time">Now</span></div>' +
        "<p>Switched to #" +
        channelName +
        "</p>" +
        "</div></div>";
    }
  }

  // --- Event Listeners ---
  chatInput.addEventListener("input", autoResize);

  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chatSendBtn.addEventListener("click", sendMessage);

  channelItems.forEach(function (ch) {
    ch.addEventListener("click", function () {
      switchChannel(this.dataset.channel);
    });
  });
})();
