// Меню для мобильных и анимация столбцов на странице опроса.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var bars = document.querySelectorAll(".bar-fill[data-w]");
  if (!bars.length) return;
  var show = function (el) { el.style.width = el.getAttribute("data-w") + "%"; };
  if (!("IntersectionObserver" in window)) { bars.forEach(show); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  bars.forEach(function (b) { io.observe(b); });
});
