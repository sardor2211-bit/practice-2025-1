// Проверка алгоритма подбора: node src/test-filin-match.js
var assert = require("assert");
var m = require("./filin-match.js");

// Строгий запрос по математике: первым должен быть строгий преподаватель.
var strict = m.matchTeachers({ subject: "math", strictness: 5, budget: 2000, format: "any" });
assert.ok(strict[0].teacher.strictness >= 4, "ожидался строгий преподаватель");

// Мягкий запрос по программированию: первым — мягкий или сбалансированный.
var soft = m.matchTeachers({ subject: "programming", strictness: 1, budget: 1000, format: "online" });
assert.ok(soft[0].teacher.strictness <= 3, "ожидался мягкий преподаватель");

// Сглаживание: 3 отзыва «5,0» ниже, чем 71 отзыв «4,9».
var t = m.FILIN_TEACHERS;
var fresh = t.filter(function (x) { return x.reviews === 3; })[0];
var veteran = t.filter(function (x) { return x.reviews === 71; })[0];
assert.ok(m.smoothedRating(fresh) < m.smoothedRating(veteran), "сглаживание рейтинга не работает");

// Оценка всегда от 0 до 100.
t.forEach(function (x) {
  var s = m.scoreTeacher(x, { subject: x.subjects[0], strictness: 3, budget: 500, format: "offline" });
  assert.ok(s.total >= 0 && s.total <= 100);
});

console.log("Все проверки пройдены");
console.log("Строгий запрос, математика:", strict.map(function (r) { return r.teacher.name + " " + r.total + "%"; }).join(", "));
console.log("Мягкий запрос, программирование:", soft.map(function (r) { return r.teacher.name + " " + r.total + "%"; }).join(", "));
