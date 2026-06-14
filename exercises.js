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

  var verbsArr = ['work', 'read', 'write', 'play', 'live', 'speak', 'sleep', 'run', 'cook', 'drive',
    'sing', 'dance', 'swim', 'draw', 'teach', 'learn', 'build', 'fix', 'wash', 'clean',
    'eat', 'drink', 'watch', 'listen', 'walk', 'talk', 'think', 'help', 'love', 'like'];

  var objsArr = ['every day', 'books', 'a letter', 'football', 'in London', 'English', 'on the sofa', 'fast', 'dinner', 'a car',
    'songs', 'beautifully', 'in the pool', 'pictures', 'at school', 'Chinese', 'a house', 'cars', 'the dishes', 'the garden',
    'pizza', 'juice', 'TV', 'to music', 'in the park', 'on the phone', 'about life', 'people', 'animals', 'ice cream'];

  // ── Russian translation maps ──
  var ruSub = { 'I': 'Я', 'You': 'Ты', 'He': 'Он', 'She': 'Она', 'It': 'Оно', 'We': 'Мы', 'They': 'Они',
    'Tom': 'Том', 'Ann': 'Анна', 'Dad': 'Папа', 'Mum': 'Мама', 'The boy': 'Мальчик', 'The girl': 'Девочка',
    'My brother': 'Мой брат', 'The kids': 'Дети', 'My friends': 'Мои друзья', 'Our parents': 'Наши родители',
    'The students': 'Студенты', 'People': 'Люди', 'Birds': 'Птицы' };

  var ruVerb = { 'work': 'работа', 'read': 'чита', 'write': 'пиш', 'play': 'игра', 'live': 'жив', 'speak': 'говор',
    'sleep': 'сп', 'run': 'бега', 'cook': 'готов', 'drive': 'водит', 'sing': 'по', 'dance': 'танцу', 'swim': 'плава',
    'draw': 'рису', 'teach': 'препода', 'learn': 'уча', 'build': 'стро', 'fix': 'чини', 'wash': 'мо', 'clean': 'убира',
    'eat': 'е', 'drink': 'пь', 'watch': 'смотрит', 'listen': 'слуша', 'walk': 'гуля', 'talk': 'разговарива',
    'think': 'дума', 'help': 'помога', 'love': 'люб', 'like': 'нрав' };

  function ruVerbEnd(v, s) {
    var base = ruVerb[v] || v;
    if (isHe(s)) return base + 'ет';
    if (s === 'I') return base + 'ю';
    return base + 'ют';
  }

  var ruObj = { 'every day': 'каждый день', 'books': 'книги', 'a letter': 'письмо', 'football': 'футбол',
    'in London': 'в Лондоне', 'English': 'по-английски', 'on the sofa': 'на диване', 'fast': 'быстро',
    'dinner': 'ужин', 'a car': 'машину', 'songs': 'песни', 'beautifully': 'красиво', 'in the pool': 'в бассейне',
    'pictures': 'рисунки', 'at school': 'в школе', 'Chinese': 'китайский', 'a house': 'дом', 'cars': 'машины',
    'the dishes': 'посуду', 'the garden': 'сад', 'pizza': 'пиццу', 'juice': 'сок', 'TV': 'телевизор',
    'to music': 'музыку', 'in the park': 'в парке', 'on the phone': 'по телефону', 'about life': 'о жизни',
    'people': 'людям', 'animals': 'животных', 'ice cream': 'мороженое' };

  function makeRuPrompt(s, v, o) {
    var rs = ruSub[s] || s;
    var rv = ruVerbEnd(v, s);
    var ro = ruObj[o] || o;
    return rs + ' ' + rv + ' ' + ro;
  }

  // ── pres-aff generate ──
  var affAll = [];
  for (var si = 0; si < allSubs.length; si++) {
    for (var vi = 0; vi < verbsArr.length; vi++) {
      for (var oi = 0; oi < objsArr.length; oi++) {
        var s = allSubs[si], v = verbsArr[vi], o = objsArr[oi];
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
  var negObjs = ['on Sunday', 'books', 'letters', 'football', 'in London', 'French', 'here', 'fast', 'meat', 'a bus',
    'at night', 'coffee', 'horror films', 'Chinese', 'pasta', 'loud music', 'the window', 'a uniform', 'milk', 'soda'];
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
      for (var oi2 = 0; oi2 < negObjs.length; oi2++) {
        var ns = negSubs[ni], nv = verbsArr[vi2], no = negObjs[oi2];
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
  var quesObjs = ['every day', 'books', 'letters', 'football', 'English', 'here', 'fast', 'dinner', 'a car',
    'songs', 'coffee', 'TV', 'to music', 'in the park', 'at school', 'Chinese', 'the guitar', 'milk', 'soda', 'ice cream'];
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
      for (var oi3 = 0; oi3 < quesObjs.length; oi3++) {
        quesAll.push({ sub: quesSubjs[qi], verb: verbsArr[vi3], obj: quesObjs[oi3] });
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
