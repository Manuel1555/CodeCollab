// ===== Star Field Generator =====
(function () {
  var container = document.getElementById("stars");
  if (!container) return;

  var count = 80;
  for (var i = 0; i < count; i++) {
    var star = document.createElement("div");
    star.className = "star";
    var size = Math.random() * 2.5 + 0.5;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.setProperty("--d", (Math.random() * 4 + 2) + "s");
    star.style.setProperty("--min", (Math.random() * 0.3).toFixed(2));
    star.style.setProperty("--max", (Math.random() * 0.5 + 0.5).toFixed(2));
    star.style.animationDelay = (Math.random() * 5) + "s";
    container.appendChild(star);
  }
})();
