(function () {
  'use strict';

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function verbS(v) {
    if (v === 'fix' || v === 'wash' || v === 'teach') return v + 'es';
    if (v.endsWith('s') || v.endsWith('z') || v.endsWith('x') || v.endsWith('ch') || v.endsWith('sh') || v.endsWith('o')) return v + 'es';
    if (v.endsWith('y') && !'aeiou'.includes(v[v.length - 2])) return v.slice(0, -1) + 'ies';
    return v + 's';
  }

  function isHe(s) { return s === 'He' || s === 'She' || s === 'It' || s === 'Tom' || s === 'Ann' || s === 'Dad' || s === 'Mum' || s === 'The boy' || s === 'The girl' || s === 'My brother'; }

  // ── Subject groups ──
  var heSubs = ['He', 'She', 'It', 'Tom', 'Ann', 'Dad', 'Mum', 'The boy', 'The girl', 'My brother'];
  var iSubs = ['I', 'You', 'We', 'They', 'The kids', 'My friends', 'Our parents', 'The students', 'People', 'Birds'];
  var allSubs = heSubs.concat(iSubs);

  // Verbs with conjugation group: 1 = -ет/-ют, 2 = -ит/-ят
  // Russian infinitive and correct he/she form
  var verbData = {
    'work':   { conj: 1, he: 'работает', they: 'работают', i: 'работаю' },
    'read':   { conj: 1, he: 'читает',   they: 'читают',   i: 'читаю' },
    'play':   { conj: 1, he: 'играет',   they: 'играют',   i: 'играю' },
    'listen': { conj: 1, he: 'слушает',  they: 'слушают',  i: 'слушаю' },
    'think':  { conj: 1, he: 'думает',   they: 'думают',   i: 'думаю' },
    'help':   { conj: 1, he: 'помогает', they: 'помогают', i: 'помогаю' },
    'clean':  { conj: 1, he: 'убирает',  they: 'убирают',  i: 'убираю' },
    'talk':   { conj: 1, he: 'разговаривает', they: 'разговаривают', i: 'разговариваю' },
    'walk':   { conj: 1, he: 'гуляет',   they: 'гуляют',   i: 'гуляю' },
    'run':    { conj: 1, he: 'бегает',   they: 'бегают',   i: 'бегаю' },
    'cook':   { conj: 2, he: 'готовит',  they: 'готовят',  i: 'готовлю' },
    'speak':  { conj: 2, he: 'говорит',  they: 'говорят',  i: 'говорю' },
    'love':   { conj: 2, he: 'любит',    they: 'любят',    i: 'люблю' },
    'watch':  { conj: 2, he: 'смотрит',  they: 'смотрят',  i: 'смотрю' },
    'build':  { conj: 2, he: 'строит',   they: 'строят',   i: 'строю' },
    'learn':  { conj: 2, he: 'учит',     they: 'учат',     i: 'учу' },
    'drive':  { conj: 2, he: 'водит',    they: 'водят',    i: 'вожу' },
    'fix':    { conj: 2, he: 'чинит',    they: 'чинят',    i: 'чиню' },
    'write':  { conj: 1, he: 'пишет',    they: 'пишут',    i: 'пишу' },
    'live':   { conj: 1, he: 'живёт',    they: 'живут',    i: 'живу' },
    'sleep':  { conj: 2, he: 'спит',     they: 'спят',     i: 'сплю' },
    'sing':   { conj: 1, he: 'поёт',     they: 'поют',     i: 'пою' },
    'dance':  { conj: 1, he: 'танцует',  they: 'танцуют',  i: 'танцую' },
    'swim':   { conj: 1, he: 'плавает',  they: 'плавают',  i: 'плаваю' },
    'draw':   { conj: 1, he: 'рисует',   they: 'рисуют',   i: 'рисую' },
    'wash':   { conj: 1, he: 'моет',     they: 'моют',     i: 'мою' },
    'eat':    { conj: 'irr', he: 'ест',   they: 'едят',    i: 'ем' },
    'drink':  { conj: 1, he: 'пьёт',     they: 'пьют',     i: 'пью' },
    'like':   { conj: 2, he: 'нравится', they: 'нравятся', i: 'нравлюсь' },
    'teach':  { conj: 1, he: 'преподаёт', they: 'преподают', i: 'преподаю' },
  };

  var verbsArr = Object.keys(verbData);

  // Objects per verb category
  var foodVerbs = ['cook', 'eat', 'drink', 'love', 'like'];
  var mediaVerbs = ['watch', 'read', 'listen', 'play', 'sing'];
  var locationVerbs = ['live', 'walk', 'run', 'work', 'swim', 'sleep'];
  var commVerbs = ['speak', 'talk', 'teach', 'learn', 'write'];
  var creationVerbs = ['draw', 'build', 'write'];
  var choreVerbs = ['wash', 'clean', 'fix', 'cook', 'drive'];
  var generalVerbs = ['work', 'read', 'play', 'listen', 'think', 'help', 'clean', 'talk', 'walk', 'run', 'drive', 'fix', 'wash', 'sleep', 'dance'];

  var objsArr = [
    // food (for cook/eat/drink/love/like)
    { obj: 'pizza', cats: 'food' },
    { obj: 'ice cream', cats: 'food' },
    { obj: 'juice', cats: 'food' },
    { obj: 'coffee', cats: 'food' },
    { obj: 'dinner', cats: 'food' },
    { obj: 'breakfast', cats: 'food' },
    { obj: 'pasta', cats: 'food' },
    // media (for watch/read/listen/play)
    { obj: 'TV', cats: 'media' },
    { obj: 'films', cats: 'media' },
    { obj: 'books', cats: 'media' },
    { obj: 'magazines', cats: 'media' },
    { obj: 'the news', cats: 'media' },
    { obj: 'to music', cats: 'media' },
    { obj: 'the radio', cats: 'media' },
    { obj: 'the guitar', cats: 'media' },
    { obj: 'football', cats: 'media' },
    { obj: 'tennis', cats: 'media' },
    { obj: 'songs', cats: 'media' },
    // location (for live/walk/run/work/swim/sleep)
    { obj: 'in London', cats: 'location' },
    { obj: 'in a flat', cats: 'location' },
    { obj: 'in a house', cats: 'location' },
    { obj: 'in the park', cats: 'location' },
    { obj: 'in the forest', cats: 'location' },
    { obj: 'in the pool', cats: 'location' },
    { obj: 'in an office', cats: 'location' },
    { obj: 'at a hospital', cats: 'location' },
    { obj: 'at school', cats: 'location' },
    { obj: 'at night', cats: 'location' },
    // communication (for speak/talk/teach/learn/write)
    { obj: 'English', cats: 'comm' },
    { obj: 'French', cats: 'comm' },
    { obj: 'Chinese', cats: 'comm' },
    { obj: 'on the phone', cats: 'comm' },
    { obj: 'a letter', cats: 'comm' },
    { obj: 'a book', cats: 'comm' },
    // creation (for draw/build/write)
    { obj: 'pictures', cats: 'creation' },
    { obj: 'a house', cats: 'creation' },
    { obj: 'a snowman', cats: 'creation' },
    // chore (for wash/clean/fix/cook/drive)
    { obj: 'the dishes', cats: 'chore' },
    { obj: 'the car', cats: 'chore' },
    { obj: 'cars', cats: 'chore' },
    { obj: 'bikes', cats: 'chore' },
    { obj: 'a car', cats: 'chore' },
    { obj: 'a bus', cats: 'chore' },
    // general (works with most verbs)
    { obj: 'every day', cats: 'general' },
    { obj: 'hard', cats: 'general' },
    { obj: 'fast', cats: 'general' },
    { obj: 'beautifully', cats: 'general' },
    { obj: 'people', cats: 'general' },
    { obj: 'friends', cats: 'general' },
    { obj: 'children', cats: 'general' },
    { obj: 'animals', cats: 'general' },
    { obj: 'music', cats: 'general' },
    { obj: 'the house', cats: 'general' },
    { obj: 'the garden', cats: 'general' },
    { obj: 'about life', cats: 'general' },
    { obj: 'about the future', cats: 'general' },
    { obj: 'in the morning', cats: 'general' },
  ];

  function verbCats(v) {
    if (foodVerbs.indexOf(v) !== -1) return ['food', 'general'];
    if (mediaVerbs.indexOf(v) !== -1) return ['media', 'general'];
    if (locationVerbs.indexOf(v) !== -1) return ['location', 'general'];
    if (commVerbs.indexOf(v) !== -1) return ['comm', 'general'];
    if (creationVerbs.indexOf(v) !== -1) return ['creation', 'general'];
    if (choreVerbs.indexOf(v) !== -1) return ['chore', 'general'];
    return ['general'];
  }

  // ── Russian translation maps ──
  var ruSub = { 'I': 'Я', 'You': 'Ты', 'He': 'Он', 'She': 'Она', 'It': 'Оно', 'We': 'Мы', 'They': 'Они',
    'Tom': 'Том', 'Ann': 'Анна', 'Dad': 'Папа', 'Mum': 'Мама', 'The boy': 'Мальчик', 'The girl': 'Девочка',
    'My brother': 'Мой брат', 'The kids': 'Дети', 'My friends': 'Мои друзья', 'Our parents': 'Наши родители',
    'The students': 'Студенты', 'People': 'Люди', 'Birds': 'Птицы' };

  function ruVerbEnd(v, s) {
    var d = verbData[v];
    if (!d) return v;
    if (isHe(s)) return d.he;
    if (s === 'I') return d.i;
    return d.they;
  }

  var ruObj = { 'every day': 'каждый день', 'books': 'книги', 'a letter': 'письмо', 'football': 'футбол',
    'in London': 'в Лондоне', 'English': 'по-английски', 'on the sofa': 'на диване', 'fast': 'быстро',
    'dinner': 'ужин', 'a car': 'машину', 'songs': 'песни', 'beautifully': 'красиво', 'in the pool': 'в бассейне',
    'pictures': 'рисунки', 'at school': 'в школе', 'Chinese': 'китайский', 'a house': 'дом', 'cars': 'машины',
    'the dishes': 'посуду', 'the garden': 'сад', 'pizza': 'пиццу', 'juice': 'сок', 'TV': 'телевизор',
    'to music': 'музыку', 'in the park': 'в парке', 'on the phone': 'по телефону', 'about life': 'о жизни',
    'people': 'людям', 'animals': 'животных', 'ice cream': 'мороженое', 'breakfast': 'завтрак',
    'pasta': 'пасту', 'the news': 'новости', 'coffee': 'кофе', 'at a hospital': 'в больнице',
    'in an office': 'в офисе', 'hard': 'усердно', 'in the morning': 'утром', 'friends': 'друзьям',
    'children': 'детям', 'the house': 'дом', 'tennis': 'теннис', 'the guitar': 'гитару',
    'the radio': 'радио', 'about the future': 'о будущем', 'in the forest': 'в лесу',
    'magazines': 'журналы', 'films': 'фильмы', 'a snowman': 'снеговика', 'bikes': 'велосипеды',
    'a flat': 'квартире', 'at night': 'ночью', 'a bus': 'автобус',
    'on Sunday': 'в воскресенье', 'French': 'по-французски', 'here': 'здесь',
    'meat': 'мясо', 'horror films': 'фильмы ужасов', 'loud music': 'громкую музыку',
    'the window': 'окно', 'a uniform': 'форму', 'milk': 'молоко', 'soda': 'газировку' };

  function makeRuPrompt(s, v, o) {
    var rs = ruSub[s] || s;
    var rv = ruVerbEnd(v, s);
    var ro = ruObj[o] || o;
    return rs + ' ' + rv + ' ' + ro;
  }

  function compatibleObjs(v) {
    var cats = verbCats(v);
    var result = [];
    for (var i = 0; i < objsArr.length; i++) {
      var entry = objsArr[i];
      for (var j = 0; j < cats.length; j++) {
        if (entry.cats === cats[j] || entry.cats === 'general') {
          result.push(entry.obj);
          break;
        }
      }
    }
    return result;
  }

  // ── pres-aff generate ──
  var affAll = [];
  for (var si = 0; si < allSubs.length; si++) {
    for (var vi = 0; vi < verbsArr.length; vi++) {
      var compatObjs = compatibleObjs(verbsArr[vi]);
      for (var oi = 0; oi < compatObjs.length; oi++) {
        var s = allSubs[si], v = verbsArr[vi], o = compatObjs[oi];
        affAll.push({ sub: s, verb: v, obj: o, verbForm: isHe(s) ? verbS(v) : v, ruPrompt: makeRuPrompt(s, v, o) });
      }
    }
  }
  shuffle(affAll);

  var affTranslate = affAll.slice(0, 100).map(function (c) {
    return { prompt: c.ruPrompt, answer: c.sub + ' ' + c.verbForm + ' ' + c.obj };
  });
  var affBuild = affAll.slice(0, 100).map(function (c) {
    return { prompt: c.ruPrompt, answer: c.sub + ' ' + c.verbForm + ' ' + c.obj };
  });
  var affFill = affAll.slice(0, 100).map(function (c) {
    return { prompt: c.sub + ' ___ ' + c.obj + '.', answer: c.verbForm, hint: c.verb };
  });
  var affChoice = affAll.slice(0, 100).map(function (c) {
    var base = c.verb;
    var wrong = isHe(c.sub) ? base : verbS(base);
    var correct = isHe(c.sub) ? verbS(base) : base;
    return { prompt: c.sub + ' ___ ' + c.obj + '. a) ' + base + '  b) ' + verbS(base), answer: correct };
  });

  // ── pres-neg ──
  var negSubs = ['I', 'You', 'He', 'She', 'We', 'They', 'Tom', 'Ann', 'The kids', 'My friends'];
  var negExtraObjs = ['on Sunday', 'French', 'here', 'meat', 'horror films', 'loud music', 'the window', 'a uniform', 'milk', 'soda'];
  function negRu(s, v, o) {
    var rs = ruSub[s] || s;
    var rv = ruVerbEnd(v, s);
    var ro = ruObj[o] || o;
    return rs + ' не ' + rv + ' ' + ro;
  }
  function negAnswer(s, v, o) {
    return isHe(s) ? s + " doesn't " + v + ' ' + o : s + " don't " + v + ' ' + o;
  }
  var negAll = [];
  for (var ni = 0; ni < negSubs.length; ni++) {
    for (var vi2 = 0; vi2 < verbsArr.length; vi2++) {
      var compatNegObjs = compatibleObjs(verbsArr[vi2]).concat(negExtraObjs);
      for (var oi2 = 0; oi2 < compatNegObjs.length; oi2++) {
        var ns = negSubs[ni], nv = verbsArr[vi2], no = compatNegObjs[oi2];
        negAll.push({ sub: ns, verb: nv, obj: no });
      }
    }
  }
  shuffle(negAll);
  var negTranslate = negAll.slice(0, 100).map(function (c) {
    return { prompt: negRu(c.sub, c.verb, c.obj), answer: negAnswer(c.sub, c.verb, c.obj) };
  });
  var negBuild = negAll.slice(0, 100).map(function (c) {
    return { prompt: negRu(c.sub, c.verb, c.obj), answer: negAnswer(c.sub, c.verb, c.obj) };
  });
  var negFill = negAll.slice(0, 100).map(function (c) {
    var helper = isHe(c.sub) ? "doesn't" : "don't";
    return { prompt: c.sub + ' ___ ' + c.verb + ' ' + c.obj + '.', answer: helper, hint: helper };
  });
  var negChoice = negAll.slice(0, 100).map(function (c) {
    var correct = isHe(c.sub) ? "doesn't" : "don't";
    return { prompt: c.sub + ' ___ ' + c.verb + ' ' + c.obj + '. a) don\'t  b) doesn\'t', answer: correct };
  });

  // ── pres-ques ──
  var quesSubjs = ['I', 'you', 'we', 'they', 'he', 'she', 'it', 'Tom', 'Ann', 'the kids'];
  var quesExtraObjs = ['here', 'coffee', 'the guitar', 'milk', 'soda', 'ice cream'];
  function isHeQ(s) { var l = s.toLowerCase(); return l === 'he' || l === 'she' || l === 'it' || s === 'Tom' || s === 'Ann'; }
  function quesAnswer(s, v, o) {
    var helper = isHeQ(s) ? 'Does' : 'Do';
    return helper + ' ' + s + ' ' + v + ' ' + o;
  }
  function quesRu(s, v, o) {
    var rs = ruSub[s] || s;
    var rv = ruVerbEnd(v, s);
    var ro = ruObj[o] || o;
    return rs + ' ' + rv + ' ' + ro + '?';
  }
  var quesAll = [];
  for (var qi = 0; qi < quesSubjs.length; qi++) {
    for (var vi3 = 0; vi3 < verbsArr.length; vi3++) {
      var compatQObjs = compatibleObjs(verbsArr[vi3]).concat(quesExtraObjs);
      for (var oi3 = 0; oi3 < compatQObjs.length; oi3++) {
        quesAll.push({ sub: quesSubjs[qi], verb: verbsArr[vi3], obj: compatQObjs[oi3] });
      }
    }
  }
  shuffle(quesAll);
  var quesTranslate = quesAll.slice(0, 100).map(function (c) {
    return { prompt: quesRu(c.sub, c.verb, c.obj), answer: quesAnswer(c.sub, c.verb, c.obj) };
  });
  var quesBuild = quesAll.slice(0, 100).map(function (c) {
    return { prompt: quesRu(c.sub, c.verb, c.obj), answer: quesAnswer(c.sub, c.verb, c.obj) };
  });
  var quesFill = quesAll.slice(0, 100).map(function (c) {
    var helper = isHeQ(c.sub) ? 'Does' : 'Do';
    return { prompt: '___ ' + c.sub + ' ' + c.verb + ' ' + c.obj + '?', answer: helper, hint: 'Do / Does' };
  });
  var quesChoice = quesAll.slice(0, 100).map(function (c) {
    var correct = isHeQ(c.sub) ? 'Does' : 'Do';
    return { prompt: '___ ' + c.sub + ' ' + c.verb + ' ' + c.obj + '? a) Do  b) Does', answer: correct };
  });

  window.COURSE_EXERCISES = {
    'pres-aff-translate': affTranslate,
    'pres-aff-build': affBuild,
    'pres-aff-fill_gap': affFill,
    'pres-aff-choice': affChoice,
    'pres-neg-translate': negTranslate,
    'pres-neg-build': negBuild,
    'pres-neg-fill_gap': negFill,
    'pres-neg-choice': negChoice,
    'pres-ques-translate': quesTranslate,
    'pres-ques-build': quesBuild,
    'pres-ques-fill_gap': quesFill,
    'pres-ques-choice': quesChoice,
  };
})();
