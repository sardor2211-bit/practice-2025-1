// Интерфейс демо-подбора: читает анкету и выводит топ-3 преподавателя.
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("match-form");
  var out = document.getElementById("results");
  var range = document.getElementById("strictness");
  var rangeValue = document.getElementById("strictness-value");

  var formatNames = { online: "Онлайн", offline: "Очно", both: "Онлайн и очно" };
  var colors = ["#22304a", "#3f8f6b", "#b86e00", "#6b4c9a", "#2a6f97", "#9a2f2c"];

  function initials(name) {
    return name.split(" ").map(function (p) { return p[0]; }).join("");
  }

  function styleChip(level) {
    var cls = level <= 2 ? "green" : level === 3 ? "blue" : "red";
    return '<span class="chip ' + cls + '">' + strictnessLabel(level) + " · " + level + "/5</span>";
  }

  function render() {
    var s = {
      subject: form.subject.value,
      strictness: Number(range.value),
      budget: Math.max(300, Number(form.budget.value) || 1500),
      format: form.format.value
    };
    rangeValue.textContent = strictnessLabel(s.strictness) + " (" + s.strictness + "/5)";

    var list = matchTeachers(s, FILIN_TEACHERS, 3);
    if (!list.length) {
      out.innerHTML = '<div class="empty">По этому предмету пока нет преподавателей.</div>';
      return;
    }

    out.innerHTML = list.map(function (r, i) {
      var t = r.teacher;
      return '<article class="card teacher' + (i === 0 ? " top" : "") + '">' +
        '<div class="avatar" style="background:' + colors[FILIN_TEACHERS.indexOf(t) % colors.length] + '">' + initials(t.name) + "</div>" +
        "<div><h3>" + (i === 0 ? "🦉 " : "") + t.name + "</h3>" +
        '<div class="note">★ ' + t.rating.toFixed(1) + " · " + t.reviews + " отзывов · " + t.price + " ₽/занятие · " + formatNames[t.format] + "</div>" +
        '<div class="tags">' + styleChip(t.strictness) +
        t.subjects.map(function (k) { return '<span class="chip light">' + FILIN_SUBJECTS[k] + "</span>"; }).join("") +
        "</div></div>" +
        '<div class="score"><b>' + r.total + "%</b><span>совпадение</span></div>" +
        "</article>";
    }).join("");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
  form.addEventListener("input", render);
  render();
});
