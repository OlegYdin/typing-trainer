(function () {
  'use strict';

  // ── helpers ──
  function cross(subs, verbs, objs) {
    const r = [];
    for (const s of subs) for (const v of verbs) for (const o of objs) r.push({ sub: s, verb: v, obj: o });
    return r;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function pickN(a, n) { var s = shuffle(a.slice()); return s.slice(0, Math.min(n, a.length)); }

  function verbS(v) {
    if (v.endsWith('s') || v.endsWith('z') || v.endsWith('x') || v.endsWith('ch') || v.endsWith('sh') || v.endsWith('o')) return v + 'es';
    if (v.endsWith('y') && !'aeiou'.includes(v[v.length - 2])) return v.slice(0, -1) + 'ies';
    return v + 's';
  }

  // ── vocab ──
  var heSubs = ['He', 'She', 'It', 'Tom', 'Ann', 'Dad', 'Mum', 'The boy', 'The girl', 'My brother'];
  var iSubs = ['I', 'You', 'We', 'They', 'The kids', 'My friends', 'Our parents', 'The students', 'People', 'Birds'];

  var verbsArr = ['work', 'read', 'write', 'play', 'live', 'speak', 'sleep', 'run', 'cook', 'drive',
    'sing', 'dance', 'swim', 'draw', 'teach', 'learn', 'build', 'fix', 'wash', 'clean',
    'eat', 'drink', 'watch', 'listen', 'walk', 'talk', 'think', 'help', 'love', 'like'];

  var objsArr = ['every day', 'books', 'a letter', 'football', 'in London', 'English', 'on the sofa', 'fast', 'dinner', 'a car',
    'songs', 'beautifully', 'in the pool', 'pictures', 'at school', 'Chinese', 'a house', 'cars', 'the dishes', 'the garden',
    'pizza', 'juice', 'TV', 'to music', 'in the park', 'on the phone', 'about life', 'people', 'animals', 'ice cream'];

  // ── pres-aff ──
  var heAff = cross(heSubs, verbsArr.map(verbS), objsArr);
  var iAff = cross(iSubs, verbsArr, objsArr);
  var affAll = heAff.concat(iAff);
  shuffle(affAll);

  var affTranslate = affAll.slice(0, 100).map(function (c) { return { prompt: '', answer: c.sub + ' ' + c.verb + ' ' + c.obj }; });
  var affBuild = affTranslate.map(function (ex) { return { prompt: '', answer: ex.answer }; });
  var affFill = affAll.slice(0, 100).map(function (c) {
    return { prompt: c.sub + ' ___ ' + c.obj + '.', answer: c.verb, hint: c.verb };
  });
  var affChoice = affAll.slice(0, 100).map(function (c) {
    var v = c.verb;
    var base = verbsArr[verbsArr.indexOf(v.replace(/s$/, '').replace(/es$/, '').replace(/ies$/, 'y'))] || v;
    if (!base) base = v;
    var wrong = base + 's';
    return { prompt: c.sub + ' ___ ' + c.obj + '. a) ' + base + '  b) ' + wrong, answer: v };
  });

  // ── pres-neg ──
  var negSubs = iSubs.concat(['He', 'She', 'It', 'Tom', 'Ann']);
  var negData = [];  // { sub, verb, obj, prompt }
  for (const s of negSubs) {
    for (const v of verbsArr) {
      for (const o of ['on Sunday', 'books', 'letters', 'football', 'in London', 'French', 'here', 'fast', 'meat', 'a bus',
        'at night', 'coffee', 'horror films', 'Chinese', 'pasta', 'loud music', 'the window', 'a uniform', 'milk', 'soda']) {
        negData.push({ sub: s, verb: v, obj: o });
      }
    }
  }
  shuffle(negData);
  function negPrompt(s, v, o) {
    if (s === 'He' || s === 'She' || s === 'It' || s === 'Tom' || s === 'Ann') return s + " doesn't " + v + ' ' + o;
    return s + " don't " + v + ' ' + o;
  }
  var negTranslate = negData.slice(0, 100).map(function (c) {
    return { prompt: '', answer: negPrompt(c.sub, c.verb, c.obj) };
  });
  var negBuild = negTranslate.map(function (ex) { return { prompt: '', answer: ex.answer }; });
  var negFill = negData.slice(0, 100).map(function (c) {
    var s = c.sub, v = c.verb, o = c.obj;
    var helper = (s === 'He' || s === 'She' || s === 'It' || s === 'Tom' || s === 'Ann') ? "doesn't" : "don't";
    return { prompt: s + ' ___ ' + v + ' ' + o + '.', answer: helper, hint: helper };
  });
  var negChoice = negData.slice(0, 100).map(function (c) {
    var s = c.sub, v = c.verb, o = c.obj;
    var correct = (s === 'He' || s === 'She' || s === 'It' || s === 'Tom' || s === 'Ann') ? "doesn't" : "don't";
    return { prompt: s + ' ___ ' + v + ' ' + o + '. a) don\'t  b) doesn\'t', answer: correct };
  });

  // ── pres-ques ──
  var quesSubs = iSubs.concat(['he', 'she', 'it', 'Tom', 'Ann']);
  var quesData = [];
  for (const s of quesSubs) {
    for (const v of verbsArr) {
      for (const o of ['every day', 'books', 'letters', 'football', 'English', 'here', 'fast', 'dinner', 'a car',
        'songs', 'coffee', 'TV', 'to music', 'in the park', 'at school', 'Chinese', 'the guitar', 'milk', 'soda', 'ice cream']) {
        quesData.push({ sub: s, verb: v, obj: o });
      }
    }
  }
  shuffle(quesData);
  function quesPrompt(s, v, o) {
    var helper = (s.toLowerCase() === 'he' || s.toLowerCase() === 'she' || s.toLowerCase() === 'it' || s === 'Tom' || s === 'Ann') ? 'Does' : 'Do';
    return helper + ' ' + s + ' ' + v + ' ' + o + '?';
  }
  var quesTranslate = quesData.slice(0, 100).map(function (c) {
    return { prompt: '', answer: quesPrompt(c.sub, c.verb, c.obj) };
  });
  var quesBuild = quesTranslate.map(function (ex) { return { prompt: '', answer: ex.answer }; });
  var quesFill = quesData.slice(0, 100).map(function (c) {
    var s = c.sub, v = c.verb, o = c.obj;
    var helper = (s.toLowerCase() === 'he' || s.toLowerCase() === 'she' || s.toLowerCase() === 'it' || s === 'Tom' || s === 'Ann') ? 'Does' : 'Do';
    return { prompt: '___ ' + s + ' ' + v + ' ' + o + '?', answer: helper, hint: 'Do / Does' };
  });
  var quesChoice = quesData.slice(0, 100).map(function (c) {
    var s = c.sub, v = c.verb, o = c.obj;
    var correct = (s.toLowerCase() === 'he' || s.toLowerCase() === 'she' || s.toLowerCase() === 'it' || s === 'Tom' || s === 'Ann') ? 'Does' : 'Do';
    return { prompt: '___ ' + s + ' ' + v + ' ' + o + '? a) Do  b) Does', answer: correct };
  });

  // ── export ──
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
