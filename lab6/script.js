(function () {
  var root = document.documentElement;

  // Газруудын мэдээлэл: зураг нь img/photo1.jpg ... photo12.jpg
  var places = [
    { n: 'Хөвсгөл нуур', t: 'lake', p: 180000, d: 'Монголын хамгийн гүн цэнгэг нуур. Зуны улиралд завь, морин аялал сайхан.' },
    { n: 'Хонгорын элс', t: 'gobi', p: 150000, d: 'Дуулдаг элсэн манхан. Тэмээ унаж, нар жаргахыг харна.' },
    { n: 'Тэрэлж', t: 'mount', p: 120000, d: 'Улаанбаатараас ойрхон. Хайрхан хад, ой, гэр кемп.' },
    { n: 'Эрдэнэ зуу хийд', t: 'history', p: 130000, d: 'Хархорумын ойролцоох Монголын эртний буддын хийд.' },
    { n: 'Цагаан суварга', t: 'gobi', p: 140000, d: 'Өнгө алаглан харагддаг шохойн хаднууд бүхий Говийн үзэмж.' },
    { n: 'Алтай Таван Богд', t: 'mount', p: 220000, d: 'Монголын хамгийн өндөр уулс, мөнх цас, мөсөн голууд.' },
    { n: 'Тэрхийн цагаан нуур', t: 'lake', p: 160000, d: 'Галт уулын лаавт бүрэлдсэн тунгалаг нуур. Хангайн уул, ойн дунд оршино.' },
    { n: 'Ёлын ам', t: 'gobi', p: 145000, d: 'Говийн дундах нарийн хавцал. Зун ч гэсэн мөс хайлдаггүй.' },
    { n: 'Бурхан Халдун', t: 'history', p: 135000, d: 'Хэнтийн ариун уул. Чингис хааны түүхтэй холбоотой дархан газар.' },
    { n: 'Хустайн нуруу', t: 'mount', p: 125000, d: 'Тахь буюу монгол адууг дахин нутагшуулсан байгалийн цогцолбор газар.' },
    { n: 'Орхоны хүрхрээ', t: 'mount', p: 130000, d: 'Орхон голын хөндийд орших, хавцалд унадаг үзэсгэлэнт хүрхрээ.' },
    { n: 'Буйр нуур', t: 'lake', p: 170000, d: 'Дорнод аймгийн нуур. Усны шувуу олноор үзэгддэг ширгээ нутаг.' }
  ];
  var fmt = function (n) { return n.toLocaleString('en-US').replace(/,/g, '’') + ' ₮'; };

  // Flip картуудыг үүсгэх ба үнэ бодогчийн жагсаалт
  var grid = document.getElementById('grid');
  var dest = document.getElementById('dest');
  places.forEach(function (x, i) {
    var a = document.createElement('article');
    a.className = 'flip';
    a.dataset.t = x.t;
    a.style.setProperty('--i', i % 6);
    a.tabIndex = 0;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-pressed', 'false');
    a.innerHTML =
      '<div class="flip-inner">' +
        '<figure class="face front"><img src="img/photo' + (i + 1) + '.jpg" alt="' + x.n + '" loading="lazy">' +
        '<figcaption><strong>' + x.n + '</strong><span>' + fmt(x.p) + ' / хүн, хоног</span></figcaption></figure>' +
        '<div class="face back"><h3>' + x.n + '</h3><p>' + x.d + '</p><ul class="info">' +
        '<li>1 хүн, 1 хоног <b>' + fmt(x.p) + '</b></li>' +
        '<li>2 хүн, 3 хоног <b>' + fmt(x.p * 6) + '</b></li>' +
        '<li>4 хүн, 5 хоног <b>' + fmt(x.p * 20) + '</b></li></ul></div>' +
      '</div>';
    function flip() {
      var on = a.classList.toggle('is-flipped');
      a.setAttribute('aria-pressed', on);
    }
    a.addEventListener('click', flip);
    a.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
    grid.appendChild(a);
    var o = document.createElement('option');
    o.value = i; o.textContent = x.n;
    dest.appendChild(o);
  });

  // Төрлөөр шүүх
  var btns = document.querySelectorAll('.filters button');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (k) { k.setAttribute('aria-pressed', k === b); });
      document.querySelectorAll('.flip').forEach(function (c) {
        c.hidden = !(b.dataset.f === 'all' || c.dataset.t === b.dataset.f);
      });
    });
  });

  // Үнэ бодогч
  var days = document.getElementById('days');
  var ppl = document.getElementById('ppl');
  var total = document.getElementById('total');
  function calc() {
    var d = Math.max(1, +days.value || 1), p = Math.max(1, +ppl.value || 1);
    total.textContent = 'Нийт: ' + fmt(places[dest.value].p * d * p);
  }
  [dest, days, ppl].forEach(function (e) { e.addEventListener('input', calc); });
  calc();

  // Харанхуй горим
  var themeBtn = document.getElementById('themeBtn');
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  themeBtn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    var dark = cur ? cur === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Утасны цэс
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
})();
