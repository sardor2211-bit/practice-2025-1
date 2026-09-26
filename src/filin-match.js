/*
 * Филин — прототип алгоритма подбора преподавателя.
 *
 * Итоговая оценка совпадения преподавателя t с запросом ученика s:
 *   S = 0,35·Sстиль + 0,30·Sрейтинг + 0,20·Sцена + 0,15·Sформат
 * Веса выбраны по результатам опроса студентов (см. survey.html).
 */

var FILIN_WEIGHTS = { style: 0.35, rating: 0.30, price: 0.20, format: 0.15 };

// Байесовское сглаживание рейтинга: у новичка с 2 отзывами «5,0»
// не должен быть выше, чем у преподавателя с 80 отзывами «4,8».
var PRIOR_RATING = 4.0;
var PRIOR_REVIEWS = 5;

// Демонстрационные данные (вымышленные преподаватели).
var FILIN_TEACHERS = [
  { name: "Ирина Волкова", subjects: ["math", "discrete"], strictness: 5, rating: 4.9, reviews: 84, price: 1800, format: "online" },
  { name: "Алексей Смирнов", subjects: ["math", "physics"], strictness: 3, rating: 4.7, reviews: 51, price: 1200, format: "both" },
  { name: "Дарья Кузнецова", subjects: ["english"], strictness: 2, rating: 4.8, reviews: 63, price: 1000, format: "online" },
  { name: "Тимур Абдуллаев", subjects: ["programming", "discrete"], strictness: 4, rating: 4.6, reviews: 37, price: 1500, format: "both" },
  { name: "Мария Орлова", subjects: ["russian", "english"], strictness: 1, rating: 4.9, reviews: 22, price: 900, format: "offline" },
  { name: "Павел Лебедев", subjects: ["physics"], strictness: 5, rating: 4.5, reviews: 40, price: 1400, format: "offline" },
  { name: "Екатерина Белова", subjects: ["math"], strictness: 2, rating: 4.4, reviews: 18, price: 800, format: "online" },
  { name: "Руслан Каримов", subjects: ["programming"], strictness: 3, rating: 4.9, reviews: 71, price: 2000, format: "online" },
  { name: "Ольга Никитина", subjects: ["russian"], strictness: 3, rating: 4.7, reviews: 45, price: 1100, format: "both" },
  { name: "Глеб Морозов", subjects: ["programming", "math"], strictness: 1, rating: 5.0, reviews: 3, price: 700, format: "online" },
  { name: "Светлана Юсупова", subjects: ["english", "russian"], strictness: 4, rating: 4.6, reviews: 29, price: 1300, format: "offline" },
  { name: "Артём Зайцев", subjects: ["physics", "math"], strictness: 4, rating: 4.8, reviews: 58, price: 1600, format: "both" }
];

var FILIN_SUBJECTS = {
  math: "Высшая математика",
  programming: "Программирование",
  physics: "Физика",
  english: "Английский язык",
  russian: "Русский язык",
  discrete: "Дискретная математика"
};

function strictnessLabel(level) {
  if (level <= 2) return "Мягкий";
  if (level === 3) return "Сбалансированный";
  return "Строгий";
}

function smoothedRating(t) {
  return (t.rating * t.reviews + PRIOR_RATING * PRIOR_REVIEWS) / (t.reviews + PRIOR_REVIEWS);
}

function scoreTeacher(t, s) {
  var style = 1 - Math.abs(t.strictness - s.strictness) / 4;
  var rating = smoothedRating(t) / 5;
  var price = t.price <= s.budget ? 1 : Math.max(0, 1 - (t.price - s.budget) / s.budget);
  var format = s.format === "any" || t.format === "both" || t.format === s.format ? 1 : 0.3;

  var total = FILIN_WEIGHTS.style * style +
    FILIN_WEIGHTS.rating * rating +
    FILIN_WEIGHTS.price * price +
    FILIN_WEIGHTS.format * format;

  return {
    teacher: t,
    total: Math.round(total * 100),
    parts: { style: style, rating: rating, price: price, format: format }
  };
}

// Возвращает до limit преподавателей, отсортированных по убыванию оценки.
function matchTeachers(s, teachers, limit) {
  return (teachers || FILIN_TEACHERS)
    .filter(function (t) { return t.subjects.indexOf(s.subject) !== -1; })
    .map(function (t) { return scoreTeacher(t, s); })
    .sort(function (a, b) { return b.total - a.total; })
    .slice(0, limit || 3);
}

if (typeof module !== "undefined") {
  module.exports = { matchTeachers: matchTeachers, scoreTeacher: scoreTeacher, smoothedRating: smoothedRating, FILIN_TEACHERS: FILIN_TEACHERS };
}
