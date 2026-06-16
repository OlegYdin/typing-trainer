(function () {
  'use strict';

  const APP_VERSION = 'v0.0.0.10';

  const CODE_LETTERS = 'abcdefghijklmnopqrstuvwxyz0123456789_.()[]{}<>+-*/%=,:;\'"!?@#$&|~^\\`'.split('');
  const CODE_KEYBOARD = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','='],
    ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['a','s','d','f','g','h','j','k','l',';','\''],
    ['z','x','c','v','b','n','m',',','.','/'],
  ];
  const SHIFT_MAP = {
    '~':'`','!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0',
    '_':'-','+':'=','{':'[','}':']','|':'\\',':':';','"':'\'','<':',','>':'.','?':'/'
  };

  const STORAGE_KEY = 'typingTrainerState_v2';
  const SAVE_DEBOUNCE_MS = 1000;

  const LANG_DATA = {
    ru: {
      letterOrder: ['а','о','т','н','е','и','с','р','в','л','к','м','д','п','у','я','ы','ь','г','з','б','ч','й','х','ж','ш','ц','щ','ф','э','ю','ъ','ё',
        'А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я',
        '.',',','!','?',':',';','"','\'','(',')'],
      initialUnlocked: 6,
      name: 'Русский',
      words: [
        'а','он','она','оно','они','мы','ты','вы',
        'нет','нас','нос','нит','ина','ена','та','на','но','то',
        'ант','тина','нина','анна','инна','нота','енот','тина',
        'кот','ток','нос','рот','том','сон','год','дом','дым','сын','сыр',
        'лес','век','мир','тир','рис','лис','кит','пир','визг','лист',
        'вода','гора','море','поле','нота','рама','каша','луна','рука','нога',
        'лампа','ручка','книга','школа','парта','окно','куча','туча','дача',
        'стол','стул','дверь','полка','нитка','маска','каска','палка','пилка',
        'берег','город','лесок','садик','домик','котик','носик','ротик',
        'работа','дорога','корова','собака','молоко','лопата','лопух',
        'самолет','вертолет','телефон','магазин','молоток','воробей',
        'карандаш','линейка','тетрадь','дневник','снеговик','снежинка',
        'бабушка','дедушка','сестричка','братишка','солнышко','деревня',
        'облако','солнце','дерево','здание','озеро','речка','лестница',
        'путешествие','приключение','воскресенье','расписание',
        'конструктор','компьютер','клавиатура','принтер','монитор',
        'календарь','словарь','учебник','учитель','школьник',
        'автомобиль','велосипед','самокат','трактор','троллейбус',
        'тренировка','соревнование','чемпионат','стадион','футбол',
        'баскетбол','волейбол','теннис','хоккей','лыжи','коньки',
        'начинать','рисовать','читать','писать','считать','играть',
        'бегать','прыгать','плавать','летать','ездить','ходить',
        'открывать','закрывать','включать','выключать','помогать',
        'вкусный','красивый','интересный','замечательный','прекрасный',
        'большой','маленький','высокий','низкий','широкий','узкий',
        'завтрак','обед','ужин','печенье','конфета','шоколад',
        'понедельник','вторник','среда','четверг','пятница','суббота',
        'январь','февраль','март','апрель','май','июнь',
        'июль','август','сентябрь','октябрь','ноябрь','декабрь',
        'человек','животное','растение','природа','воздух','звезда',
        'север','юг','запад','восток','страна','столица',
        'русский','английский','математика','история','рисование','пение',
        'праздник','каникулы','отпуск','выходной','рождение','свадьба',
        'веселый','грустный','добрый','злой','смелый','честный',
        'музыка','песня','танец','сцена','артист','зритель',
        'золотой','серебряный','медный','железный','деревянный','стеклянный',
        'сегодня','завтра','вчера','сейчас','потом','раньше',
        'всегда','никогда','иногда','часто','редко','снова',
        'пожалуйста','спасибо','здравствуйте','до свидания','извините',
        'комната','кухня','спальня','ванная','гостиная','коридор',
        'бабочка','стрекоза','кузнечик','муравей','паук','пчела',
        'ворона','воробей','синица','сорока','голубь','журавль',
        'земляника','черника','голубика','брусника','малина','смородина',
        'апельсин','мандарин','лимон','банан','яблоко','груша',
        'огурец','помидор','картошка','морковка','капуста','лук',
        'тарелка','чашка','ложка','вилка','кастрюля','сковорода',
        'рубашка','брюки','пальто','шапка','шарф','сапоги',
        'пушистый','гладкий','шершавый','мягкий','твердый','теплый',
        'аквариум','террариум','зоопарк','музей','театр','цирк',
        'библиотека','аптека','больница','школа','университет',
        'светофор','переход','остановка','вокзал','аэропорт',
        'радость','счастье','надежда','верность',
      ],
      keyboardRows: [
        ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
        ['ф','ы','в','а','п','р','о','л','д','ж','э'],
        ['я','ч','с','м','и','т','ь','б','ю','ё'],
      ],
    },
    en: {
      letterOrder: ['a','e','t','n','o','i','s','r','h','l','d','c','u','m','p','f','g','y','w','b','v','k','x','j','q','z',
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
        '.',',','!','?',':',';','"','\'','(',')'],
      initialUnlocked: 4,
      name: 'English',
      words: [
        'a','an','at','am','as','be','by','do','go','he','if','in','is','it',
        'me','my','no','of','on','or','so','to','up','us','we',
        'the','and','are','for','not','but','had','has','her','his','its',
        'may','new','now','one','our','out','own','put','say','she','too',
        'two','use','way','who','you','all','any','big','can','day','did',
        'end','far','few','get','got','how','let','man','men','old','ran',
        'see','set','sit','sky','sun','ten','try','was','yes',
        'about','after','again','also','best','call','came','come','dark',
        'done','down','each','even','find','fire','fish','form','from',
        'give','good','hand','have','hear','help','here','high','hill',
        'hold','home','hope','just','keep','kind','know','land','last',
        'life','like','line','link','list','live','long','look','made',
        'make','many','mark','more','most','move','much','must','name',
        'near','need','next','note','open','over','page','part','past',
        'path','pick','play','pull','rain','read','real','rest','room',
        'root','rule','said','same','seem','show','side','sign','sing',
        'size','some','song','sort','star','stay','step','stop','such',
        'sure','take','talk','tell','test','text','than','that','them',
        'then','they','this','time','told','took','tree','true','turn',
        'unit','upon','very','walk','wall','want','warm','wash','wave',
        'week','well','went','were','west','what','when','whom','wide',
        'wild','will','wind','wish','with','wood','word','wore','work',
        'year','about','above','added','allow','along','among','alive',
        'basic','began','being','below','birth','black','block','blood',
        'board','break','bread','bring','broad','brown','build','built',
        'carry','catch','cause','chain','chair','cheap','check','child',
        'civil','claim','class','clean','clear','climb','clock','close',
        'cloud','coast','color','count','court','cover','cross','crowd',
        'daily','dance','death','depth','dress','dream','drive','early',
        'earth','eight','empty','enemy','enjoy','enter','error','event',
        'every','exact','exist','extra','faint','faith','false','field',
        'fight','final','first','fixed','floor','focus','force','forth',
        'found','frame','fresh','front','fruit','fully','funny','giant',
        'glass','globe','grace','grade','grain','grand','grant','grasp',
        'grave','great','green','gross','group','grown','guard','guess',
        'guest','guide','happy','heart','heavy','horse','hotel','house',
        'human','ideal','image','imply','index','inner','input','issue',
        'joint','judge','known','label','labor','large','later','laugh',
        'layer','learn','least','leave','legal','level','light','limit',
        'local','logic','loose','lover','lower','loyal','lunch','magic',
        'major','maker','march','match','maybe','mayor','media','mercy',
        'merit','metal','meter','might','minor','mixed','model','money',
        'month','moral','motor','mount','mouth','movie','music','nerve',
        'never','night','noble','noise','north','novel','nurse','occur',
        'ocean','offer','often','onset','opera','orbit','order','organ',
        'other','outer','owner','paint','panel','paper','party','paste',
        'patch','pause','peace','phase','phone','photo','piano','piece',
        'pilot','pitch','place','plain','plane','plant','plate','point',
        'polar','pound','power','press','price','pride','prime','print',
        'prior','prize','proof','proud','prove','pulse','punch','pupil',
        'purse','queen','quest','queue','quick','quiet','quite','quota',
        'quote','radar','radio','raise','rally','ranch','range','rapid',
        'ratio','reach','react','ready','realm','rebel','refer','reign',
        'relax','relay','reply','rider','ridge','rifle','rigid','risen',
        'risky','rival','river','robot','rocky','rough','round','route',
        'royal','rugby','ruler','rural','saint','salad','sauce','scale',
        'scare','scene','scent','scope','score','sense','serve','setup',
        'seven','shade','shaft','shake','shall','shame','shape','share',
        'sharp','sheer','sheet','shelf','shell','shift','shine','shirt',
        'shock','shore','short','shout','shown','sight','since','sixth',
        'sixty','skill','slave','sleep','slice','slide','slope','small',
        'smart','smell','smile','smoke','snake','solid','solve','sorry',
        'south','space','spare','spark','speak','speed','spell','spend',
        'spent','spice','spill','spine','split','spoke','spoon','sport',
        'spray','squad','stack','staff','stage','stain','stair','stake',
        'stale','stalk','stall','stamp','stand','stare','stark','start',
        'state','stash','steak','steal','steam','steel','steep','steer',
        'stern','stick','stiff','still','sting','stock','stone','stood',
        'stool','store','storm','story','stove','stuff','style','sugar',
        'suite','sunny','super','surge','swamp','swear','sweat','sweep',
        'sweet','swift','swing','sword','syrup','table','taste','teach',
        'teeth','tense','tenth','theme','there','these','thick','thief',
        'thing','think','third','thorn','those','three','threw','throw',
        'thumb','tidal','tight','timer','title','today','token','total',
        'touch','tough','towel','tower','toxic','trace','track','trade',
        'trail','train','trait','trash','treat','trend','trial','tribe',
        'trick','tried','troop','truck','truly','trump','trust','truth',
        'tumor','twice','ultra','uncle','under','union','unite','unity',
        'until','upper','upset','urban','usage','usual','valid','value',
        'valve','vapor','vault','venue','verse','video','vigor','vinyl',
        'viola','viral','visit','vista','vital','vivid','vocal','voice',
        'voter','vowel','waist','waste','watch','water','weary','weave',
        'weigh','weird','whale','wheat','wheel','where','which','while',
        'white','whole','whose','width','woman','world','worry','worse',
        'worst','worth','would','wound','wreck','wrist','write','wrote',
        'yield','young','youth',
      ],
      keyboardRows: [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['z','x','c','v','b','n','m'],
      ],
    },
    py: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'Python',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'print','def','return','if','else','elif','for','in','range','while','class',
        'import','from','as','True','False','None','self','__init__','len','str','int',
        'list','dict','try','except','lambda','map','filter','sorted','enumerate','zip',
        'input','open','with','read','write','append','keys','values','items',
        'not','and','or','is','pass','break','continue','raise','yield',
        'global','nonlocal','finally','del','assert','type','super',
        '__str__','__repr__','__add__','__len__','float','bool','set','tuple',
        'reversed','any','all','sum','min','max','abs','round','pow',
        'isinstance','issubclass','hasattr','getattr','setattr','delattr',
        '__file__','__name__','__doc__','format','hex','oct','bin','ord','chr',
        'staticmethod','classmethod','property','string','bytes','bytearray',
        'SyntaxError','ValueError','TypeError','KeyError','IndexError','AttributeError',
        'StopIteration','GeneratorExit','KeyboardInterrupt','SystemExit','Exception',
      ],
    },
    java: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'Java',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'public','class','static','void','main','String','int','double','boolean',
        'if','else','for','while','do','switch','case','break','continue','return',
        'new','null','true','false','this','super','extends','implements',
        'import','package','private','protected','abstract','final',
        'try','catch','throw','throws','finally','interface','enum',
        'System','out','print','println','Scanner','ArrayList','HashMap',
        'HashSet','List','Map','Set','Integer','Double','Boolean','Object',
        'Math','random','length','char','float','long','short','byte',
        'Arrays','Collections','Comparator','Override','Deprecated',
        'synchronized','volatile','transient','native','strictfp','instanceof',
        'assert','enum','record','sealed','permits','var','yield','StringBuilder',
        'IOException','RuntimeException','NullPointerException','IllegalArgumentException',
        'FileNotFoundException','ClassNotFoundException','ArithmeticException',
      ],
    },
    html: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'HTML',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'html','head','body','div','span','a','href','link','script','style',
        'meta','title','header','footer','nav','main','section','article','aside',
        'p','h1','h2','h3','h4','h5','h6','ul','ol','li','table','tr','td','th',
        'thead','tbody','form','input','button','select','option','textarea','label',
        'img','src','alt','width','height','class','id','data','role',
        'br','hr','strong','em','b','i','u','pre','code','blockquote',
        'cite','abbr','time','address','figure','figcaption','picture','source',
        'video','audio','canvas','svg','path','circle','rect','line',
        'text','g','defs','use','symbol','marker','linearGradient','stop',
        'filter','colgroup','col','caption','optgroup','datalist','fieldset','legend',
        'output','progress','meter','details','summary','dialog','template','slot',
        'charset','viewport','description','keywords','author','stylesheet','icon',
        'manifest','color','media','method','action','enctype','accept','multiple',
        'disabled','readonly','placeholder','autofocus','required','pattern','minlength',
        'maxlength','min','max','step','autocomplete','novalidate','formaction',
        'formmethod','formenctype','formtarget','formnovalidate','target','rel','type',
      ],
    },
    php: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'PHP',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'echo','print','function','return','if','else','elseif','for','foreach',
        'while','do','switch','case','break','continue','class','public','private',
        'protected','static','__construct','__destruct','__get','__set','__call',
        '__toString','new','this','parent','self','interface','implements',
        'abstract','final','trait','use','namespace','require','include',
        'require_once','include_once','define','defined','isset','empty','unset',
        'array','count','strlen','strpos','substr','str_replace','implode','explode',
        'json_encode','json_decode','file_get_contents','file_put_contents',
        'header','session_start','session_destroy','null','true','false',
        'die','exit','var_dump','print_r','is_array','is_string','is_int',
        'is_object','method_exists','property_exists','class_exists','function_exists',
        'array_map','array_filter','array_reduce','array_merge','array_keys','array_values',
        'in_array','preg_match','preg_replace','explode','implode','str_split',
        'htmlspecialchars','htmlentities','strip_tags','trim','nl2br','addslashes',
        'DateTime','DateTimeZone','DateInterval','DatePeriod','Exception','PDO','mysqli',
        'filter_input','filter_var','session_start','setcookie','mail','mkdir','rmdir',
        'unlink','file_exists','is_dir','is_file','is_readable','is_writable',
      ],
    },
    js: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'JavaScript',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'function','return','var','let','const','if','else','for','while','do',
        'switch','case','break','continue','class','extends','new','this','super',
        'import','export','default','from','async','await','try','catch','throw',
        'finally','typeof','instanceof','null','undefined','true','false',
        'Array','Object','String','Number','Boolean','Math','Date','RegExp',
        'Map','Set','Promise','Symbol','console','log','error','warn',
        'document','window','querySelector','querySelectorAll','getElementById',
        'createElement','addEventListener','removeEventListener',
        'fetch','then','catch','finally','JSON','stringify','parse',
        'push','pop','shift','unshift','splice','slice',
        'map','filter','reduce','forEach','some','every','find','findIndex',
        'includes','indexOf','keys','values','entries','length','prototype',
        'bind','call','apply','arguments','yield','generator',
        'proxy','reflect','WeakMap','WeakSet','Proxy','Reflect',
        'Set','Map','WeakMap','WeakSet','BigInt','globalThis',
        'Error','TypeError','RangeError','ReferenceError','SyntaxError',
        'URIError','EvalError','AggregateError','classList','dataset',
        'insertAdjacentHTML','insertAdjacentElement','insertAdjacentText',
        'requestAnimationFrame','cancelAnimationFrame','setTimeout','setInterval',
        'clearTimeout','clearInterval','localStorage','sessionStorage','crypto',
      ],
    },
    sql: {
      letterOrder: CODE_LETTERS,
      initialUnlocked: CODE_LETTERS.length,
      name: 'SQL',
      keyboardRows: CODE_KEYBOARD,
      words: [
        'SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET','DELETE',
        'CREATE','TABLE','DROP','ALTER','ADD','COLUMN','INDEX','VIEW',
        'PROCEDURE','FUNCTION','TRIGGER','IF','NOT','EXISTS','PRIMARY','KEY',
        'FOREIGN','REFERENCES','CASCADE','UNIQUE','DEFAULT','CHECK','CONSTRAINT',
        'AUTO_INCREMENT','INT','INTEGER','VARCHAR','TEXT','BOOLEAN','FLOAT',
        'DOUBLE','DECIMAL','DATE','DATETIME','TIMESTAMP','BLOB','ENUM',
        'NULL','AND','OR','IN','BETWEEN','LIKE','ORDER','BY','ASC','DESC',
        'GROUP','HAVING','COUNT','SUM','AVG','MIN','MAX',
        'JOIN','INNER','LEFT','RIGHT','OUTER','ON','AS','UNION','ALL',
        'DISTINCT','TOP','LIMIT','OFFSET','CASE','WHEN','THEN','ELSE','END',
        'EXISTS','ANY','SOME','IS','TRUE','FALSE','GRANT','REVOKE',
        'COMMIT','ROLLBACK','SAVEPOINT','BEGIN','TRANSACTION','LOCK','TABLE',
        'EXPLAIN','ANALYZE','DESCRIBE','SHOW','USE','DATABASE','SCHEMA',
        'RENAME','TRUNCATE','REPLACE','MERGE','UPSERT','WITH','RECURSIVE',
        'WINDOW','RANK','ROW_NUMBER','DENSE_RANK','LEAD','LAG','FIRST_VALUE',
        'LAST_VALUE','NTH_VALUE','NTILE','CUME_DIST','PERCENT_RANK',
        'INDEXED','BY','STORED','VIRTUAL','GENERATED','ALWAYS','IDENTITY',
        'SERIAL','BIGINT','SMALLINT','TINYINT','NUMERIC','REAL','MONEY',
        'NCHAR','NVARCHAR','NTEXT','IMAGE','XML','JSON','ARRAY','MAP',
        'STRUCT','UNIONTYPE','INTERVAL','YEAR','MONTH','DAY','HOUR','MINUTE',
        'SECOND','MICROSECOND','WEEK','QUARTER',
      ],
    },
  };



  function getDefaultPerLang(lang) {
    return {
      unlockedCount: LANG_DATA[lang].initialUnlocked,
      consecutivePasses: 0,
      lessonsDone: 0,
      lastDate: '',
      lastSpeed: 0, prevSpeed: 0,
      lastAccuracy: 0, prevAccuracy: 0,
      charStats: {},
      totalLessons: 0,
      totalTimeSpent: 0,
      bestSpeed: 0,
      bestAccuracy: 0,
      totalCharsTyped: 0,
      history: [],
      keyPresses: 0,

    };
  }

  function getDefaultState() {
    const langs = Object.keys(LANG_DATA);
    const state = {
      language: 'ru',
      dailyGoal: 20,
      speedReq: 200,
      accuracyReq: 0.95,
      consecutiveReq: 5,
      textLength: 50,
      uiScale: 100,
      showKeyboard: true,
      theme: 'dark',
    };
    for (const lng of langs) state[lng] = getDefaultPerLang(lng);
    return state;
  }

  let state;
  let textChars = [];
  let currentIndex = 0;
  let totalCorrect = 0;
  let totalErrors = 0;
  let startTime = null;
  let isActive = false;
  let isComplete = false;
  let charStatus = [];
  let inlineEditingTarget = null;
  let ysdk = null;
  let playerData = null;
  let saveDebounceTimer = null;
  let isOfflineMode = false;
  let authToken = null;
  let authUser = null;
  const API_HOST = '';

  const textDisplay = document.getElementById('textDisplay');
  const progressBar = document.getElementById('progressBar');
  const speedDisplay = document.getElementById('speedDisplay');
  const accuracyDisplay = document.getElementById('accuracyDisplay');
  const lessonDisplay = document.getElementById('lessonDisplay');
  const streakDisplay = document.getElementById('streakDisplay');
  const streakStat = document.getElementById('streakStat');
  const hintText = document.getElementById('hintText');
  const lettersGrid = document.getElementById('lettersGrid');
  const keyboard = document.getElementById('keyboard');
  const nextLetter = document.getElementById('nextLetter');
  const unlockedCount = document.getElementById('unlockedCount');
  const totalCount = document.getElementById('totalCount');
  const targetSpeed = document.getElementById('targetSpeed');
  const targetAccuracy = document.getElementById('targetAccuracy');
  const targetStreak = document.getElementById('targetStreak');
  const targetStreakItem = document.getElementById('targetStreakItem');
  const newTextBtn = document.getElementById('newTextBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const resetBtn = document.getElementById('resetBtn');
  const langSelect = document.getElementById('langSelect');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalBtn = document.getElementById('modalBtn');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const dailyGoalInput = document.getElementById('dailyGoalInput');
  const speedInput = document.getElementById('speedInput');
  const accuracyInput = document.getElementById('accuracyInput');
  const streakInput = document.getElementById('streakInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const statsBtn = document.getElementById('statsBtn');
  const statsOverlay = document.getElementById('statsOverlay');
  const closeStatsBtn = document.getElementById('closeStatsBtn');
  const statTotalLessons = document.getElementById('statTotalLessons');
  const statTotalTime = document.getElementById('statTotalTime');
  const statTotalChars = document.getElementById('statTotalChars');
  const statBestSpeed = document.getElementById('statBestSpeed');
  const statBestAccuracy = document.getElementById('statBestAccuracy');
  const statUnlockedLetters = document.getElementById('statUnlockedLetters');
  const statCurrentStage = document.getElementById('statCurrentStage');
  const statTabs = document.querySelectorAll('.stat-tab');
  const statPanels = document.querySelectorAll('.stat-panel');
  const historyList = document.getElementById('historyList');
  const chartSpeed = document.getElementById('chartSpeed');
  const chartAccuracy = document.getElementById('chartAccuracy');
  const chartProgress = document.getElementById('chartProgress');
  const lrSpeed = document.getElementById('lrSpeed');
  const lrSpeedDelta = document.getElementById('lrSpeedDelta');
  const lrAccuracy = document.getElementById('lrAccuracy');
  const lrAccuracyDelta = document.getElementById('lrAccuracyDelta');
  const lrEmpty = document.getElementById('lrEmpty');
  const lastResultBody = document.getElementById('lastResultBody');
  const textLengthInput = document.getElementById('textLengthInput');
  const scaleInput = document.getElementById('scaleInput');
  const scaleLabel = document.getElementById('scaleLabel');
  const showKeyboardChk = document.getElementById('showKeyboardChk');
  const themeSelect = document.getElementById('themeSelect');
  const mainTitle = document.getElementById('mainTitle');
  const nextLetterHint = document.getElementById('nextLetterHint');
  const speedStat = document.getElementById('speedStat');
  const accuracyStat = document.getElementById('accuracyStat');
  const targetSpeedItem = document.getElementById('targetSpeedItem');
  const targetAccuracyItem = document.getElementById('targetAccuracyItem');
  const lastResultCard = document.getElementById('lastResultCard');
  const sideCardTitle = document.getElementById('sideCardTitle');
  const sideCardLabel = document.getElementById('sideCardLabel');
  const sideCardSub = document.getElementById('sideCardSub');
  const sidePanel = document.querySelector('.side-panel');
  const lessonStat = document.getElementById('lessonStat');
  const keyPressCounter = document.getElementById('keyPressCounter');
  const keyPressValue = document.getElementById('keyPressValue');
  const keyPressLang = document.getElementById('keyPressLang');

  function populateLangSelect() {
    langSelect.innerHTML = '';
    for (const key of Object.keys(LANG_DATA)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = LANG_DATA[key].name;
      langSelect.appendChild(opt);
    }
  }

  function cur() { return state[state.language]; }
  function langData() { return LANG_DATA[state.language]; }

  function getUnlockedLetters() {
    return new Set(langData().letterOrder.slice(0, cur().unlockedCount));
  }

  function getNextUnlockLetter() {
    return cur().unlockedCount < langData().letterOrder.length
      ? langData().letterOrder[cur().unlockedCount]
      : null;
  }



  function getFilteredWords() {
    const unlocked = getUnlockedLetters();
    return langData().words.filter(w => {
      for (const ch of w) {
        if (!unlocked.has(ch.toLowerCase())) return false;
      }
      return true;
    });
  }

  function isUpper(ch) { return /^[A-ZА-ЯЁ]$/.test(ch); }
  function isPunct(ch) { return '.,!?:;"\'()'.indexOf(ch) >= 0; }

  function generateText() {
    const words = getFilteredWords();
    const unlocked = getUnlockedLetters();
    const upperUnlocked = langData().letterOrder.filter(ch => isUpper(ch) && unlocked.has(ch));
    const punctUnlocked = langData().letterOrder.filter(ch => isPunct(ch) && unlocked.has(ch));
    if (words.length === 0) {
      const allLetters = Array.from(unlocked);
      const len = Math.max(10, state.textLength + Math.floor(Math.random() * 20) - 10);
      let fallback = '';
      for (let i = 0; i < len; i++) {
        fallback += allLetters[i % allLetters.length];
      }
      return fallback;
    }

    let result = [];
    let targetLen = Math.max(10, state.textLength + Math.floor(Math.random() * 20) - 10);
    let currentLen = 0;

    while (currentLen < targetLen) {
      let word = words[Math.floor(Math.random() * words.length)];
      if (upperUnlocked.length > 0 && (result.length === 0 || Math.random() < 0.1)) {
        const upper = word[0].toUpperCase();
        if (upperUnlocked.includes(upper)) {
          word = upper + word.slice(1);
        }
      }
      if (result.length > 0) {
        result.push(' ');
        currentLen += 1;
      }
      result.push(word);
      currentLen += word.length;
      if (punctUnlocked.length > 0 && result.length > 0 && Math.random() < 0.15 + (result.length >= 5 ? 0.1 : 0)) {
        result[result.length - 1] += punctUnlocked[Math.floor(Math.random() * punctUnlocked.length)];
        currentLen += 1;
      }
    }

    return result.join('');
  }

  function renderText() {
    textDisplay.innerHTML = '';
    textChars = [];
    charStatus = [];

    let text = generateText();
    let hint = '';

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      textChars.push(ch);
      const span = document.createElement('span');
      span.textContent = ch;
      if (ch === ' ') span.style.opacity = '0.3';
      textDisplay.appendChild(span);
    }

    if (textChars.length > 0) {
      textDisplay.children[0].classList.add('char-current');
    }

    currentIndex = 0;
    totalCorrect = 0;
    totalErrors = 0;
    isComplete = false;
    startTime = null;
    isActive = false;
    updateProgress();
    updateStats();
    updateKeyboard(0);
    hintText.textContent = hint ? '📖 ' + hint : 'Нажми любую клавишу, чтобы начать';
    document.querySelectorAll('.stat-value').forEach(v => v.style.color = '');
  }

  function renderLetters() {
    lettersGrid.innerHTML = '';
    const order = langData().letterOrder;
    lettersGrid.classList.toggle('compact', order.length > 40);
    nextLetterHint.style.display = '';
    sideCardLabel.textContent = 'Буквы';
    sideCardLabel.style.cursor = '';
    sideCardLabel.title = '';
    sideCardSub.style.display = '';
    for (let i = 0; i < order.length; i++) {
      const ch = order[i];
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      tile.textContent = ch;
      if (i < cur().unlockedCount) {
        tile.classList.add('unlocked');
        const errRate = getCharErrorRate(ch);
        if (errRate > 0.05) {
          const t = Math.min((errRate - 0.05) / 0.35, 1);
          const br = Math.round(108 + (220 - 108) * t);
          const bg = Math.round(99 - 40 * t);
          const bb = Math.round(255 - 100 * t);
          tile.style.background = 'rgb(' + br + ',' + bg + ',' + bb + ')';
          tile.style.borderColor = 'rgba(239, 68, 68, ' + (0.4 + t * 0.6) + ')';
          tile.style.boxShadow = '0 0 ' + (3 + t * 6) + 'px rgba(239, 68, 68, ' + (0.2 + t * 0.4) + ')';
        }
      } else if (i === cur().unlockedCount) {
        tile.classList.add('current-stage');
        tile.title = 'Следующий символ для открытия';
      } else {
        tile.classList.add('locked');
      }
      lettersGrid.appendChild(tile);
    }

    unlockedCount.textContent = cur().unlockedCount;
    totalCount.textContent = order.length;
    const next = getNextUnlockLetter();
    if (next) {
      nextLetter.textContent = next.toUpperCase();
      nextLetter.style.transform = '';
    } else if (cur().unlockedCount >= order.length) {
      nextLetter.textContent = '✓';
      nextLetter.style.transform = 'scale(1.2)';
    } else {
      nextLetter.textContent = '✓';
    }
  }



  function renderKeyboard() {
    keyboard.innerHTML = '';
    const unlocked = getUnlockedLetters();

    for (const row of langData().keyboardRows) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';
      for (const ch of row) {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = ch;
        key.dataset.char = ch;
        key.classList.add(unlocked.has(ch) ? 'unlocked' : 'locked');
        rowDiv.appendChild(key);
      }
      keyboard.appendChild(rowDiv);
    }
  }

  function updateKeyboard(index) {
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach(k => k.classList.remove('current-key'));
    if (index >= 0 && index < textChars.length) {
      const ch = textChars[index];
      if (ch !== ' ') {
        const mapped = SHIFT_MAP[ch] || ch.toLowerCase();
        const target = keyboard.querySelector('.key[data-char="' + mapped + '"]');
        if (target) target.classList.add('current-key');
      }
    }
  }



  function updateProgress() {
    if (textChars.length === 0) return;
    progressBar.style.width = Math.min((currentIndex / textChars.length) * 100, 100) + '%';
  }

  function updateKeyPressDisplay() {
    if (!keyPressCounter || !keyPressValue || !keyPressLang) return;
    const c = cur();
    keyPressValue.textContent = c.keyPresses.toLocaleString();
    const names = { ru: 'RU', en: 'EN', py: 'PY', java: 'JAVA', html: 'HTML', php: 'PHP', js: 'JS', sql: 'SQL' };
    keyPressLang.textContent = names[state.language] || state.language.toUpperCase();
  }

  function updateStats() {
    const duration = startTime ? (Date.now() - startTime) / 1000 : 0;
    const typed = totalCorrect + totalErrors;
    const speed = duration > 0 ? Math.round((totalCorrect / duration) * 60) : 0;
    const accuracy = typed > 0 ? Math.round((totalCorrect / typed) * 100) : 100;

    speedDisplay.textContent = speed;
    accuracyDisplay.textContent = accuracy + '%';
    lessonDisplay.textContent = cur().lessonsDone + '/' + state.dailyGoal;
    streakDisplay.textContent = cur().consecutivePasses + '/' + state.consecutiveReq;
    lessonStat.style.display = '';
    speedStat.style.display = '';
    accuracyStat.style.display = '';
    streakStat.style.display = '';
    targetSpeedItem.style.display = '';
    targetAccuracyItem.style.display = '';
    targetStreakItem.style.display = '';
    lastResultCard.style.display = '';
    if (inlineEditingTarget !== 'targetSpeed') targetSpeed.textContent = state.speedReq;
    if (inlineEditingTarget !== 'targetAccuracy') targetAccuracy.textContent = Math.round(state.accuracyReq * 100);
    if (inlineEditingTarget !== 'targetStreak') targetStreak.textContent = state.consecutiveReq;
    langSelect.value = state.language;

    updateKeyPressDisplay();
    updateLastResult();
  }

  function updateLastResult() {
    const c = cur();
    const hasData = c.lastSpeed > 0 || c.lastAccuracy > 0;
    lrEmpty.style.display = hasData ? 'none' : 'block';
    lastResultBody.style.display = hasData ? 'flex' : 'none';

    if (!hasData) return;

    lrSpeed.textContent = c.lastSpeed + ' симв/мин';
    lrAccuracy.textContent = c.lastAccuracy + '%';

    if (c.totalLessons >= 2) {
      const speedDelta = c.lastSpeed - c.prevSpeed;
      const accDelta = c.lastAccuracy - c.prevAccuracy;
      renderDelta(lrSpeedDelta, speedDelta, 'симв/мин');
      renderDelta(lrAccuracyDelta, accDelta, '%');
    } else {
      lrSpeedDelta.textContent = '';
      lrAccuracyDelta.textContent = '';
    }
  }

  function renderDelta(el, value, unit) {
    if (value > 0) {
      el.textContent = '+' + value + ' ' + unit;
      el.className = 'lr-delta up';
    } else if (value < 0) {
      el.textContent = value + ' ' + unit;
      el.className = 'lr-delta down';
    } else {
      el.textContent = '±0';
      el.className = 'lr-delta neutral';
    }
  }

  function getCurrentStats() {
    const duration = startTime ? (Date.now() - startTime) / 1000 : 1;
    const typed = totalCorrect + totalErrors;
    const speed = Math.round((totalCorrect / duration) * 60);
    const accuracy = typed > 0 ? totalCorrect / typed : 1;
    return { speed, accuracy, totalCorrect, totalErrors, duration };
  }

  function checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    for (const lng of Object.keys(LANG_DATA)) {
      if (state[lng].lastDate !== today) {
        state[lng].lessonsDone = 0;
        state[lng].consecutivePasses = 0;
        state[lng].lastDate = today;
      }
    }
    debouncedSaveState();
  }

  function trackCharStat(ch, correct) {
    if (ch === ' ') return;
    const lower = ch.toLowerCase();
    const stats = cur().charStats;
    if (!stats[lower]) stats[lower] = { c: 0, i: 0 };
    if (correct) stats[lower].c++;
    else stats[lower].i++;
  }

  function getCharErrorRate(ch) {
    const s = cur().charStats[ch.toLowerCase()];
    if (!s || (s.c + s.i) === 0) return 0;
    if (s.c + s.i < 15) return 0;
    return s.i / (s.c + s.i);
  }

  function ensureStateStructure(raw) {
    if (!raw || typeof raw !== 'object') return getDefaultState();
    const def = getDefaultState();
    for (const key of Object.keys(def)) {
      if (typeof def[key] === 'object' && def[key] !== null && !Array.isArray(def[key])) {
        if (!raw[key] || typeof raw[key] !== 'object') raw[key] = { ...def[key] };
        else raw[key] = { ...def[key], ...raw[key] };
      } else if (raw[key] === undefined) {
        raw[key] = def[key];
      }
    }
    return raw;
  }

  function debouncedSaveState() {
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(saveState, SAVE_DEBOUNCE_MS);
  }

  function saveState() {
    try {
      const data = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, data);
      if (!isOfflineMode && ysdk) {
        ysdk.saveGame({ data }).catch(function (err) {
          console.warn('saveGame failed:', err);
          isOfflineMode = true;
        });
      }
      if (authToken) {
        saveCloudState();
      }
    } catch (e) {
      console.warn('saveState error:', e);
    }
  }

  function loadState() {
    return new Promise(function (resolve) {
      function fromLocalStorage() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) return ensureStateStructure(JSON.parse(raw));
        } catch (e) { console.warn('localStorage load failed:', e); }
        return null;
      }

      function resolveBest() {
        var local = fromLocalStorage();
        resolve(local || getDefaultState());
      }

      function tryYandex() {
        if (typeof window.YaGames !== 'undefined') {
          window.YaGames.init().then(function (sdk) {
            ysdk = sdk;
            return ysdk.getPlayer({ signed: true });
          }).then(function (player) {
            playerData = player;
            if (player.getMode() === 'offline') {
              isOfflineMode = true;
              resolveBest();
              return;
            }
            return ysdk.loadGame();
          }).then(function (saved) {
            if (saved && saved.data) {
              try {
                resolve(ensureStateStructure(saved.data));
              } catch (e) {
                console.warn('saved data parse failed:', e);
                resolveBest();
              }
            } else {
              resolveBest();
            }
          }).catch(function (err) {
            console.warn('SDK init/load failed, using localStorage:', err);
            isOfflineMode = true;
            resolveBest();
          });
        } else {
          resolveBest();
        }
      }

      tryYandex();
    });
  }

  function apiCall(path, body) {
    return fetch(API_HOST + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (r) { return r.json(); }).catch(function () { return { error: 'Connection failed' }; });
  }

  function updateAuthUI() {
    var nameEl = document.getElementById('userName');
    var signIn = document.getElementById('signInBtn');
    var signOut = document.getElementById('signOutBtn');
    if (!nameEl) return;
    if (authUser) {
      nameEl.textContent = authUser.display_name || authUser.username || 'Пользователь';
      if (signIn) signIn.classList.add('hidden');
      if (signOut) signOut.classList.remove('hidden');
    } else {
      nameEl.textContent = 'Гость';
      if (signIn) signIn.classList.remove('hidden');
      if (signOut) signOut.classList.add('hidden');
    }
  }

  function showAuthOverlay() {
    var el = document.getElementById('authOverlay');
    if (el) el.classList.remove('hidden');
  }

  function hideAuthOverlay() {
    var el = document.getElementById('authOverlay');
    if (el) el.classList.add('hidden');
    hideAuthError();
  }

  function showAuthError(msg) {
    var el = document.getElementById('authError');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  }

  function hideAuthError() {
    var el = document.getElementById('authError');
    if (el) el.classList.add('hidden');
  }

  function saveAuthToStorage() {
    if (authToken && authUser) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }

  function restoreAuthFromStorage() {
    var token = localStorage.getItem('authToken');
    var user = localStorage.getItem('authUser');
    if (token && user) {
      authToken = token;
      try { authUser = JSON.parse(user); } catch (e) { authUser = null; }
      updateAuthUI();
      return true;
    }
    return false;
  }

  function signInWithPhrase(username, phrase, isRegister) {
    if (!username.trim()) { showAuthError('Введите имя'); return; }
    if (!phrase.trim()) { showAuthError('Введите фразу'); return; }
    hideAuthError();
    apiCall('/api/' + (isRegister ? 'register' : 'login'), { username: username.trim(), phrase: phrase, display_name: username.trim() }).then(function (res) {
      if (res.error) { showAuthError(res.error); return; }
      authToken = res.token;
      authUser = { user_id: res.user_id, username: username.trim(), display_name: res.display_name };
      saveAuthToStorage();
      updateAuthUI();
      hideAuthOverlay();
      if (authToken) { loadCloudState(); }
      if (!isRegister) {
        showModal('С возвращением, ' + username.trim() + '!', 'Ваш прогресс загружен. Продолжайте в том же духе!');
      } else {
        showModal('Добро пожаловать, ' + username.trim() + '! 🎉', 'Вы только что сделали первый шаг к тому, чтобы печатать со скоростью мысли. Слепая печать в XXI веке — это не просто навык, а суперсила, которая экономит часы каждый день. Удачи в тренировках!');
      }
    });
  }

  function signOutUser() {
    authToken = null;
    authUser = null;
    saveAuthToStorage();
    updateAuthUI();
  }

  function saveCloudState() {
    if (!authToken) return;
    var langs = Object.keys(LANG_DATA);
    for (var i = 0; i < langs.length; i++) {
      var lang = langs[i];
      apiCall('/api/save', { token: authToken, language: lang, data: state[lang] });
    }
  }

  function loadCloudState() {
    if (!authToken) return;
    apiCall('/api/load', { token: authToken }).then(function (res) {
      if (res.error) return;
      if (res.progress) {
        var langs = Object.keys(res.progress);
        for (var i = 0; i < langs.length; i++) {
          var lang = langs[i];
          if (res.progress[lang] && state[lang]) {
            var merged = res.progress[lang];
            if (merged.unlocked > state[lang].unlocked) state[lang].unlocked = merged.unlocked;
            if (merged.consecutive > state[lang].consecutive) state[lang].consecutive = merged.consecutive;
            if (merged.maxSpeed > state[lang].maxSpeed) state[lang].maxSpeed = merged.maxSpeed;
            if (merged.bestAccuracy > state[lang].bestAccuracy) state[lang].bestAccuracy = merged.bestAccuracy;
            if (merged.totalLessons > state[lang].totalLessons) state[lang].totalLessons = merged.totalLessons;
            if (merged.history && merged.history.length > (state[lang].history || []).length) {
              state[lang].history = merged.history;
            }
          }
        }
        renderLetters();
        updateStats();
      }
    });
  }

  function submitLeaderboard(language, speed, accuracy, totalChars) {
    if (!authToken) return;
    apiCall('/api/leaderboard/submit', { token: authToken, language: language, speed: Math.round(speed), accuracy: Math.round(accuracy), total_chars: totalChars });
  }

  function showLeaderboard() {
    var overlay = document.getElementById('leaderboardOverlay');
    if (overlay) overlay.classList.remove('hidden');
    renderLeaderboard('');
  }

  function closeLeaderboard() {
    var overlay = document.getElementById('leaderboardOverlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function renderLeaderboard(lang) {
    var content = document.getElementById('leaderboardContent');
    if (!content) return;
    content.innerHTML = '<div class="leaderboard-empty">Загрузка...</div>';
    var activeDiff = document.querySelector('[data-lb-diff].active');
    var diff = activeDiff ? activeDiff.dataset.lbDiff : '';
    var params = [];
    if (lang) params.push('lang=' + encodeURIComponent(lang));
    if (diff) params.push('difficulty=' + encodeURIComponent(diff));
    var url = API_HOST + '/api/leaderboard' + (params.length ? '?' + params.join('&') : '');
    fetch(url).then(function (r) { return r.json(); }).then(function (entries) {
      if (!entries || !entries.length) {
        content.innerHTML = '<div class="leaderboard-empty">Пока нет записей</div>';
        return;
      }
      var html = '<div class="lb-table"><div class="lb-row lb-header"><span class="lb-rank">#</span><span class="lb-name">Имя</span><span class="lb-lang">Язык</span><span class="lb-speed">Скорость</span><span class="lb-acc">Точность</span><span class="lb-diff">Ур.</span></div>';
      entries.forEach(function (e, i) {
        var cls = i < 3 ? ' lb-top lb-top-' + (i + 1) : '';
        var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
        var lvl = e.difficulty || 0;
        html += '<div class="lb-row' + cls + '"><span class="lb-rank">' + medal + '</span><span class="lb-name">' + escHtml(e.display_name || 'Unknown') + '</span><span class="lb-lang">' + escHtml(e.language || '—') + '</span><span class="lb-speed">' + Math.round(e.speed) + '</span><span class="lb-acc">' + Math.round(e.accuracy) + '%</span><span class="lb-diff">' + lvl + '</span></div>';
      });
      html += '</div>';
      content.innerHTML = html;
    }).catch(function () {
      content.innerHTML = '<div class="leaderboard-empty">Ошибка загрузки</div>';
    });
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function showSuggestions() {
    document.getElementById('suggestionsOverlay').classList.remove('hidden');
    renderSuggestions();
  }

  function closeSuggestions() {
    document.getElementById('suggestionsOverlay').classList.add('hidden');
  }

  var ADMIN_USERNAME = 'OlegYdin';
  var editSuggestionId = null;

  function renderSuggestions() {
    var content = document.getElementById('suggestionsContent');
    if (!content) return;
    content.innerHTML = '<div class="leaderboard-empty">Загрузка...</div>';
    var url = API_HOST + '/api/suggestions';
    if (authUser && authUser.user_id) url += '?user_id=' + authUser.user_id;
    fetch(url).then(function (r) { return r.json(); }).then(function (items) {
      if (!items || !items.length) {
        content.innerHTML = '<div class="leaderboard-empty">Пока нет предложений. Будьте первым!</div>';
        return;
      }
      var html = '';
      items.forEach(function (s) {
        var votedClass = s.user_voted ? ' voted' : '';
        var isAuthor = authUser && authUser.user_id === s.user_id;
        var isAdmin = authUser && authUser.username === ADMIN_USERNAME;
        var actions = '';
        if (isAuthor) actions += '<button class="btn-sm" onclick="window.__editSuggestion(' + s.id + ')">✏️</button>';
        if (isAdmin) actions += '<button class="btn-sm" style="color:var(--incorrect)" onclick="window.__deleteSuggestion(' + s.id + ')">🗑️</button>';
        html += '<div class="suggestion-card" data-id="' + s.id + '">'
          + '<div class="suggestion-header">'
          + '<div class="suggestion-title">' + escHtml(s.title) + '</div>'
          + '<div class="suggestion-author">' + escHtml(s.display_name) + ' · ' + new Date(s.created_at).toLocaleDateString('ru-RU') + '</div>'
          + '</div>'
          + (s.description ? '<div class="suggestion-desc">' + escHtml(s.description) + '</div>' : '')
          + '<div class="suggestion-actions">'
          + '<button class="suggestion-vote-btn' + votedClass + '" onclick="window.__voteSuggestion(' + s.id + ')">👍 <span class="vote-count">' + s.votes + '</span></button>'
          + '<button class="suggestion-comment-toggle" onclick="window.__toggleComments(' + s.id + ')">💬 ' + s.comments + ' комментариев</button>'
          + actions
          + '</div>'
          + '<div class="suggestion-comments hidden" id="comments-' + s.id + '"></div>'
          + '</div>';
      });
      content.innerHTML = html;
    }).catch(function () {
      content.innerHTML = '<div class="leaderboard-empty">Ошибка загрузки</div>';
    });
  }

  window.__editSuggestion = function (id) {
    if (!authToken) { showAuthOverlay(); return; }
    fetch(API_HOST + '/api/suggestions').then(function (r) { return r.json(); }).then(function (items) {
      var s = items.find(function (x) { return x.id === id; });
      if (!s) return;
      editSuggestionId = id;
      document.querySelector('#suggestionFormOverlay h2').textContent = 'Редактировать идею';
      document.getElementById('suggestionTitleInput').value = s.title;
      document.getElementById('suggestionDescInput').value = s.description || '';
      document.getElementById('suggestionFormOverlay').classList.remove('hidden');
    });
  };

  window.__deleteSuggestion = function (id) {
    if (!authToken) { showAuthOverlay(); return; }
    if (!confirm('Удалить это предложение?')) return;
    apiCall('/api/suggestions/' + id + '/delete', { token: authToken }).then(function (res) {
      if (res.error === 'Not authenticated') { authToken = null; authUser = null; saveAuthToStorage(); updateAuthUI(); showAuthOverlay(); return; }
      if (res.error === 'Forbidden') { alert('Нет прав'); return; }
      renderSuggestions();
    });
  };

  window.__voteSuggestion = function (id) {
    if (!authToken) { showAuthOverlay(); return; }
    apiCall('/api/suggestions/' + id + '/vote', { token: authToken }).then(function (res) {
      if (res.error === 'Not authenticated') { authToken = null; authUser = null; saveAuthToStorage(); updateAuthUI(); showAuthOverlay(); return; }
      if (res.error) return;
      renderSuggestions();
    });
  };

  window.__toggleComments = function (id) {
    var el = document.getElementById('comments-' + id);
    if (!el) return;
    var isHidden = el.classList.contains('hidden');
    if (isHidden) {
      el.classList.remove('hidden');
      el.innerHTML = '<div class="leaderboard-empty" style="padding:8px 0">Загрузка...</div>';
      fetch(API_HOST + '/api/suggestions/' + id + '/comments').then(function (r) { return r.json(); }).then(function (comments) {
        var html = '';
        comments.forEach(function (c) {
          var isAuthor = authUser && authUser.user_id === c.user_id;
          var isAdmin = authUser && authUser.username === ADMIN_USERNAME;
          var commentActions = '';
          if (isAuthor) commentActions += '<button class="btn-sm" onclick="window.__editComment(' + id + ',' + c.id + ')">✏️</button>';
          if (isAdmin) commentActions += '<button class="btn-sm" style="color:var(--incorrect)" onclick="window.__deleteComment(' + id + ',' + c.id + ')">🗑️</button>';
          html += '<div class="comment-item"><span class="comment-author">' + escHtml(c.display_name) + '</span><span class="comment-text">';
          html += '<span class="comment-text-display" id="ctext-' + c.id + '">' + escHtml(c.text) + '</span>';
          html += commentActions;
          html += '</span><span class="comment-date">' + new Date(c.created_at).toLocaleString('ru-RU') + '</span></div>';
        });
        html += '<div class="comment-form">'
          + '<input type="text" id="comment-input-' + id + '" placeholder="Написать комментарий..." onkeydown="if(event.key==\'Enter\'&&!event.shiftKey){event.preventDefault();window.__submitComment(' + id + ')}">'
          + '<button class="btn btn-primary" onclick="window.__submitComment(' + id + ')">Отправить</button>'
          + '</div>';
        el.innerHTML = html;
        var inp = document.getElementById('comment-input-' + id);
        if (inp) inp.focus();
      });
    } else {
      el.classList.add('hidden');
    }
  };

  window.__submitComment = function (id) {
    if (!authToken) { showAuthOverlay(); return; }
    var inp = document.getElementById('comment-input-' + id);
    if (!inp || !inp.value.trim()) return;
    apiCall('/api/suggestions/' + id + '/comments', { token: authToken, text: inp.value.trim() }).then(function (res) {
      if (res.error === 'Not authenticated') { authToken = null; authUser = null; saveAuthToStorage(); updateAuthUI(); showAuthOverlay(); return; }
      if (res.error) return;
      inp.value = '';
      window.__toggleComments(id);
      renderSuggestions();
    });
  };

  window.__editComment = function (suggId, commentId) {
    if (!authToken) { showAuthOverlay(); return; }
    var el = document.getElementById('ctext-' + commentId);
    if (!el) return;
    var current = el.textContent;
    var input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.style.cssText = 'width:80%;background:var(--surface);border:1px solid var(--accent);border-radius:4px;color:var(--text);font:inherit;padding:2px 6px;';
    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();
    function done() {
      var val = input.value.trim();
      if (!val) { el.textContent = current; return; }
      apiCall('/api/suggestions/' + suggId + '/comments/' + commentId + '/edit', { token: authToken, text: val }).then(function (res) {
        if (res.ok) { el.textContent = val; }
        else { el.textContent = current; }
      });
    }
    input.addEventListener('blur', done);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); done(); }
      if (e.key === 'Escape') { el.textContent = current; }
    });
  };

  window.__deleteComment = function (suggId, commentId) {
    if (!authToken) { showAuthOverlay(); return; }
    if (!confirm('Удалить этот комментарий?')) return;
    apiCall('/api/suggestions/' + suggId + '/comments/' + commentId + '/delete', { token: authToken }).then(function (res) {
      if (res.error === 'Not authenticated') { authToken = null; authUser = null; saveAuthToStorage(); updateAuthUI(); showAuthOverlay(); return; }
      if (res.error === 'Forbidden') { alert('Нет прав'); return; }
      window.__toggleComments(suggId);
      renderSuggestions();
    });
  };

  function openSuggestionForm() {
    if (!authToken) { showAuthOverlay(); return; }
    editSuggestionId = null;
    document.getElementById('suggestionTitleInput').value = '';
    document.getElementById('suggestionDescInput').value = '';
    document.getElementById('suggestionFormOverlay').classList.remove('hidden');
    document.querySelector('#suggestionFormOverlay h2').textContent = 'Новая идея';
  }

  function closeSuggestionForm() {
    document.getElementById('suggestionFormOverlay').classList.add('hidden');
  }

  function submitSuggestion() {
    if (!authToken) { showAuthOverlay(); return; }
    var title = document.getElementById('suggestionTitleInput').value.trim();
    var desc = document.getElementById('suggestionDescInput').value.trim();
    if (!title) { alert('Введите заголовок'); return; }
    var url = editSuggestionId ? ('/api/suggestions/' + editSuggestionId + '/edit') : '/api/suggestions';
    apiCall(url, { token: authToken, title: title, description: desc }).then(function (res) {
      if (res.error === 'Not authenticated') { authToken = null; authUser = null; saveAuthToStorage(); updateAuthUI(); showAuthOverlay(); return; }
      if (res.error) { alert(res.error); return; }
      closeSuggestionForm();
      renderSuggestions();
    });
  }

  function handleKeyDown(e) {
    if (e.repeat) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Backspace') {
      if (currentIndex > 0) {
        currentIndex--;
        const status = charStatus[currentIndex];
        if (status === 'correct') totalCorrect--;
        else if (status === 'incorrect') totalErrors--;
        charStatus[currentIndex] = null;

        const span = textDisplay.children[currentIndex];
        span.className = '';
        span.style = '';
        const ch = textChars[currentIndex];
        if (ch === ' ') span.style.opacity = '0.3';
        span.classList.add('char-current');

        isComplete = false;
        updateKeyboard(currentIndex);
        updateProgress();
    updateStats();
    applyScale(state.uiScale || 100);
  }
      return;
    }

    if (isComplete) return;

    const key = e.key;
    if (key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();

    if (!isActive) {
      isActive = true;
      startTime = Date.now();
      hintText.textContent = '';
    }

    cur().keyPresses++;
    updateKeyPressDisplay();

    if (currentIndex >= textChars.length) return;

    const expected = textChars[currentIndex];
    const spans = textDisplay.children;

    spans[currentIndex].classList.remove('char-current');

    if (key === expected) {
      spans[currentIndex].classList.add('char-correct');
      charStatus[currentIndex] = 'correct';
      totalCorrect++;
      trackCharStat(expected, true);
    } else {
      spans[currentIndex].classList.add('char-incorrect');
      charStatus[currentIndex] = 'incorrect';
      totalErrors++;
      trackCharStat(expected, false);
    }

    currentIndex++;

    if (currentIndex < textChars.length) {
      spans[currentIndex].classList.add('char-current');
      updateKeyboard(currentIndex);
    } else {
      updateKeyboard(-1);
      isComplete = true;
      onTextComplete();
    }

    updateProgress();
    updateStats();
  }

  function onTextComplete() {
    const { speed, accuracy, totalCorrect, totalErrors, duration } = getCurrentStats();
    const metTarget = accuracy >= state.accuracyReq && speed >= state.speedReq;
    const c = cur();

    c.lessonsDone++;
    c.totalLessons++;
    c.totalTimeSpent += Math.round(duration);
    c.totalCharsTyped += totalCorrect + totalErrors;
    if (speed > c.bestSpeed) c.bestSpeed = speed;
    const accPct = Math.round(accuracy * 100);
    if (accPct > c.bestAccuracy) c.bestAccuracy = accPct;
    c.prevSpeed = c.lastSpeed;
    c.prevAccuracy = c.lastAccuracy;
    c.lastSpeed = speed;
    c.lastAccuracy = accPct;

    let title, msg;

    if (metTarget) {
      const allUnlocked = c.unlockedCount >= langData().letterOrder.length;
      if (allUnlocked) {
        c.consecutivePasses = 0;
        title = 'Цель достигнута!';
        msg = 'Скорость: ' + speed + ' симв/мин · Точность: ' + accPct + '%<br><br>'
          + 'Все символы открыты! Просто продолжайте практиковаться.';
      } else {
        c.consecutivePasses++;
        if (c.consecutivePasses >= state.consecutiveReq) {
          const newLetter = langData().letterOrder[c.unlockedCount];
          c.unlockedCount++;
          c.consecutivePasses = 0;
          title = 'Новая буква открыта!';
          msg = 'Следующая буква <strong>' + newLetter.toUpperCase() + '</strong> теперь доступна!<br><br>'
            + 'Скорость: ' + speed + ' симв/мин<br>'
            + 'Точность: ' + accPct + '%<br><br>'
            + 'Урок ' + c.lessonsDone + '/' + state.dailyGoal;
          renderLetters();
          renderKeyboard();
        } else {
          title = 'Цель достигнута!';
          msg = 'Скорость: ' + speed + ' симв/мин · Точность: ' + accPct + '%<br><br>'
            + 'Осталось раз подряд: ' + c.consecutivePasses + '/' + state.consecutiveReq;
        }
      }
    } else {
      c.consecutivePasses = 0;
      const accNeed = Math.round(state.accuracyReq * 100);
      title = 'Попробуйте ещё раз';
      msg = 'Скорость: ' + speed + ' симв/мин (нужно ' + state.speedReq + ')<br>'
        + 'Точность: ' + accPct + '% (нужно ' + accNeed + '%)<br><br>'
        + 'Постарайтесь быстрее и без ошибок!';
    }

    if (c.lessonsDone >= state.dailyGoal) {
      msg += '<br><br>Дневная норма выполнена! Отдохните.';
    }

    c.history.push({
      ts: Date.now(),
      speed: speed,
      accuracy: accPct,
      duration: Math.round(duration),
      chars: totalCorrect + totalErrors,
      metTarget: metTarget,
      language: state.language
    });
    if (c.history.length > 500) c.history.shift();

    saveState();
    submitLeaderboard(state.language, speed, accPct, totalCorrect + totalErrors);
    renderLetters();
    updateStats();
    showModal(title, msg);
  }

  function showModal(title, html) {
    modalTitle.textContent = title;
    modalText.innerHTML = html;
    modalOverlay.classList.remove('hidden');
    modalBtn.focus();
  }

  function hideModal() {
    modalOverlay.classList.add('hidden');
  }

  function showStats() {
    const c = cur();
    const mins = Math.round(c.totalTimeSpent / 60);
    statTotalLessons.textContent = c.totalLessons;
    statTotalTime.textContent = mins + ' мин';
    statTotalChars.textContent = c.totalCharsTyped.toLocaleString();
    statBestSpeed.textContent = c.bestSpeed + ' симв/мин';
    statBestAccuracy.textContent = c.bestAccuracy + '%';
    statUnlockedLetters.textContent = c.unlockedCount + ' / ' + langData().letterOrder.length;
    const next = getNextUnlockLetter();
    statCurrentStage.textContent = next ? 'следующая: ' + next.toUpperCase() : 'все открыты';

    const totalKeyPresses = Object.values(state).reduce(function (sum, langState) {
      return sum + (langState.keyPresses || 0);
    }, 0);
    const keyPressesEl = document.getElementById('statTotalKeyPresses');
    if (keyPressesEl) keyPressesEl.textContent = totalKeyPresses.toLocaleString();

    renderKeyPressesByLang();
    renderHistory(c.history);
    renderCharts(c.history);
    statsOverlay.classList.remove('hidden');
  }

  function renderKeyPressesByLang() {
    const container = document.getElementById('keyPressesByLang');
    if (!container) return;
    const names = { ru: 'Русский', en: 'English', py: 'Python', java: 'Java', html: 'HTML', php: 'PHP', js: 'JavaScript', sql: 'SQL' };
    const rows = Object.entries(state).filter(function (_ref) {
      var key = _ref[0];
      return LANG_DATA[key];
    }).map(function (_ref2) {
      var key = _ref2[0];
      var langState = _ref2[1];
      var presses = langState.keyPresses || 0;
      return '<div class="key-press-lang-row"><span class="kl-name">' + (names[key] || key) + '</span><span class="kl-value">' + presses.toLocaleString() + '</span></div>';
    }).join('');
    container.innerHTML = '<div class="key-presses-title">Нажатий по раскладкам:</div>' + rows;
  }

  function closeStats() {
    statsOverlay.classList.add('hidden');
  }

  function renderHistory(history) {
    if (!history || history.length === 0) {
      historyList.innerHTML = '<div class="stat-panel-empty">Пока нет завершённых уроков</div>';
      return;
    }
    const items = history.slice().reverse().map(function (h) {
      const date = new Date(h.ts);
      const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      return '<div class="history-item' + (h.metTarget ? '' : ' failed') + '">'
        + '<span class="history-date">' + dateStr + '</span>'
        + '<div class="history-main">'
        + '<span class="history-speed">' + h.speed + ' симв/мин</span>'
        + '<span class="history-accuracy">Точность: ' + h.accuracy + '% · ' + h.chars + ' симв</span>'
        + '</div>'
        + '<span class="history-met ' + (h.metTarget ? 'success' : 'fail') + '">'
        + (h.metTarget ? '✓ Цель' : '✗ Провал')
        + '</span>'
        + '</div>';
    }).join('');
    historyList.innerHTML = items;
  }

  function renderCharts(history) {
    if (!history || history.length < 2) {
      [chartSpeed, chartAccuracy, chartProgress].forEach(function (c) {
        if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
      });
      return;
    }
    drawChart(chartSpeed, history.map(function (h) { return h.speed; }), '#6c63ff', 'Скорость (симв/мин)');
    drawChart(chartAccuracy, history.map(function (h) { return h.accuracy; }), '#4ade80', 'Точность (%)');
    drawChart(chartProgress, history.map(function (h, i) { return i + 1; }), '#fbbf24', 'Урок №');
  }

  function drawChart(canvas, data, color, label) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || canvas.clientWidth || 400;
    const cssH = rect.height || canvas.clientHeight || 200;
    if (cssW === 0 || cssH === 0) return;
    const w = cssW * dpr;
    const h = cssH * dpr;
    canvas.width = w;
    canvas.height = h;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);
    if (data.length < 2) return;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pad = 30;
    const stepX = (cssW - pad * 2) / (data.length - 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach(function (val, i) {
      const x = pad + i * stepX;
      const y = cssH - pad - ((val - min) / range) * (cssH - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    data.forEach(function (val, i) {
      const x = pad + i * stepX;
      const y = cssH - pad - ((val - min) / range) * (cssH - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = '11px var(--font-mono)';
    ctx.fillStyle = '#6b6b8d';
    ctx.fillText(label, 8, 16);
  }

  function resetAndGenerate() {
    hideModal();
    renderText();
  }

  function resetProgress() {
    if (!confirm('Сбросить весь прогресс по языку ' + langData().name + '?')) return;
    state[state.language] = getDefaultPerLang(state.language);
    debouncedSaveState();
    renderLetters();
    renderKeyboard();
    renderText();
    updateStats();
    hintText.textContent = 'Прогресс сброшен';
  }

  function switchLanguage() {
    const newLang = langSelect.value;
    if (newLang === state.language) return;
    if (isActive && currentIndex > 0 && !isComplete) {
      if (!confirm('Переключить язык? Текущий текст будет потерян.')) {
        langSelect.value = state.language;
        return;
      }
    }
    state.language = newLang;
    debouncedSaveState();
    renderKeyboard();
    renderLetters();
    renderText();
    updateStats();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
  }

  function applyScale(pct) {
    const app = document.getElementById('app');
    if (app) app.style.zoom = (pct / 100).toFixed(2);
  }

  function openSettings() {
    dailyGoalInput.value = state.dailyGoal;
    speedInput.value = state.speedReq;
    accuracyInput.value = Math.round(state.accuracyReq * 100);
    streakInput.value = state.consecutiveReq;
    textLengthInput.value = state.textLength;
    scaleInput.value = state.uiScale || 100;
    scaleLabel.textContent = scaleInput.value + '%';
    showKeyboardChk.checked = state.showKeyboard !== false;
    themeSelect.value = state.theme || 'dark';
    settingsOverlay.classList.remove('hidden');
  }

  function saveSettings() {
    state.dailyGoal = Math.max(1, parseInt(dailyGoalInput.value) || 20);
    state.speedReq = Math.max(10, parseInt(speedInput.value) || 200);
    state.accuracyReq = Math.min(100, Math.max(50, parseInt(accuracyInput.value) || 95)) / 100;
    state.consecutiveReq = Math.max(1, parseInt(streakInput.value) || 5);
    state.textLength = Math.max(10, Math.min(500, parseInt(textLengthInput.value) || 50));
    state.uiScale = Math.max(50, Math.min(150, parseInt(scaleInput.value) || 100));
    state.showKeyboard = showKeyboardChk.checked;
    state.theme = themeSelect.value;
    applyTheme(state.theme);
    applyScale(state.uiScale);
    saveState();
    renderText();
    updateStats();
    closeSettings();
  }

  function closeSettings() {
    settingsOverlay.classList.add('hidden');
  }

  function makeInlineEditable(el, stateKey, parser, formatter, min, max) {
    let input = null;
    el.title = 'Двойной клик для изменения';
    el.style.cursor = 'pointer';
    el.style.borderBottom = '1px dashed rgba(108,99,255,0.3)';

    el.addEventListener('dblclick', function () {
      if (input || inlineEditingTarget) return;
      inlineEditingTarget = el.id;
      const current = el.textContent;
      input = document.createElement('input');
      input.type = 'number';
      input.value = current;
      input.min = min || 0;
      input.max = max || 999;
      input.style.cssText = 'width:' + (current.length * 10 + 20) + 'px;background:var(--surface2);border:1px solid var(--accent);border-radius:4px;color:var(--text);font:inherit;text-align:center;outline:none;padding:2px 4px;';
      el.textContent = '';
      el.appendChild(input);
      input.focus();
      input.select();

      function finalize() {
        if (!input) return;
        const val = parser(input.value);
        inlineEditingTarget = null;
        if (!isNaN(val) && val >= (min || 0) && val <= (max || 999)) {
          state[stateKey] = val;
          debouncedSaveState();
          input = null;
          updateStats();
          renderText();
          return;
        }
        el.textContent = formatter(state[stateKey]);
        input = null;
      }

      input.addEventListener('blur', finalize);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); finalize(); }
        if (e.key === 'Escape') {
          el.textContent = formatter(state[stateKey]);
          input = null;
          inlineEditingTarget = null;
        }
      });
    });
  }

  function init() {
    var ver = document.getElementById('appVersion');
    if (ver) ver.textContent = APP_VERSION;

    loadState().then(function (loadedState) {
      state = loadedState;
      checkDailyReset();
      totalCount.textContent = langData().letterOrder.length;
      renderKeyboard();
      renderLetters();
      renderText();
      updateStats();
      document.addEventListener('keydown', handleKeyDown);
      populateLangSelect();
      langSelect.value = state.language;
      langSelect.addEventListener('change', switchLanguage);
      newTextBtn.addEventListener('click', function () {
        if (isActive && currentIndex > 0 && !isComplete) {
          if (!confirm('Начать новый текст? Текущий прогресс будет потерян.')) return;
        }
        hideModal();
        renderText();
      });
      makeInlineEditable(targetSpeed, 'speedReq', parseInt, function (v) { return v; }, 10, 500);
      makeInlineEditable(targetAccuracy, 'accuracyReq', function (v) { return Math.min(100, Math.max(50, parseInt(v))) / 100; }, function (v) { return Math.round(v * 100); }, 50, 100);
      makeInlineEditable(targetStreak, 'consecutiveReq', parseInt, function (v) { return v; }, 1, 50);
      settingsBtn.addEventListener('click', openSettings);
      resetBtn.addEventListener('click', resetProgress);
      modalBtn.addEventListener('click', resetAndGenerate);
      saveSettingsBtn.addEventListener('click', saveSettings);
      closeSettingsBtn.addEventListener('click', closeSettings);
      statsBtn.addEventListener('click', showStats);
      closeStatsBtn.addEventListener('click', closeStats);
      statTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          statTabs.forEach(function (t) { t.classList.remove('active'); });
          statPanels.forEach(function (p) { p.classList.remove('active'); });
          tab.classList.add('active');
          var panel = document.getElementById('panel-' + tab.dataset.tab);
          panel.classList.add('active');
          if (tab.dataset.tab === 'charts') {
            requestAnimationFrame(function () {
              renderCharts(cur().history);
            });
          }
        });
      });
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) hideModal();
      });
      settingsOverlay.addEventListener('click', function (e) {
        if (e.target === settingsOverlay) closeSettings();
      });
      statsOverlay.addEventListener('click', function (e) {
        if (e.target === statsOverlay) closeStats();
      });
      scaleInput.addEventListener('input', function () {
        scaleLabel.textContent = scaleInput.value + '%';
      });
      (function setupAuth() {
        var signInBtn = document.getElementById('signInBtn');
        var signOutBtn = document.getElementById('signOutBtn');
        var authUsernameInput = document.getElementById('authUsernameInput');
        var authPhraseInput = document.getElementById('authPhraseInput');
        var authPhraseLogin = document.getElementById('authPhraseLogin');
        var authPhraseRegister = document.getElementById('authPhraseRegister');
        if (signInBtn) signInBtn.addEventListener('click', showAuthOverlay);
        if (signOutBtn) signOutBtn.addEventListener('click', signOutUser);
        if (authPhraseLogin) authPhraseLogin.addEventListener('click', function () {
          signInWithPhrase(authUsernameInput ? authUsernameInput.value.trim() : '', authPhraseInput ? authPhraseInput.value : '', false);
        });
        if (authPhraseRegister) authPhraseRegister.addEventListener('click', function () {
          signInWithPhrase(authUsernameInput ? authUsernameInput.value.trim() : '', authPhraseInput ? authPhraseInput.value : '', true);
        });
        if (authPhraseInput) authPhraseInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            signInWithPhrase(authUsernameInput ? authUsernameInput.value.trim() : '', authPhraseInput.value, false);
          }
        });
        var authOverlay = document.getElementById('authOverlay');
        if (authOverlay) authOverlay.addEventListener('click', function (e) {
          if (e.target === authOverlay) hideAuthOverlay();
        });
        updateAuthUI();
      })();

      (function setupLeaderboard() {
        var lbBtn = document.getElementById('leaderboardBtn');
        var closeLbBtn = document.getElementById('closeLeaderboardBtn');
        var lbOverlay = document.getElementById('leaderboardOverlay');
        var lbTabs = lbOverlay ? lbOverlay.querySelectorAll('.stat-tab[data-lb-lang]') : [];
        if (lbBtn) lbBtn.addEventListener('click', showLeaderboard);
        if (closeLbBtn) closeLbBtn.addEventListener('click', closeLeaderboard);
        if (lbOverlay) lbOverlay.addEventListener('click', function (e) {
          if (e.target === lbOverlay) closeLeaderboard();
        });
        lbTabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            lbTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            renderLeaderboard(tab.dataset.lbLang);
          });
        });
      })();

      (function setupSuggestions() {
        var btn = document.getElementById('suggestionsBtn');
        var closeBtn = document.getElementById('closeSuggestionsBtn');
        var overlay = document.getElementById('suggestionsOverlay');
        var addBtn = document.getElementById('addSuggestionBtn');
        var submitBtn = document.getElementById('submitSuggestionBtn');
        var cancelBtn = document.getElementById('cancelSuggestionBtn');
        var formOverlay = document.getElementById('suggestionFormOverlay');
        if (btn) btn.addEventListener('click', showSuggestions);
        if (closeBtn) closeBtn.addEventListener('click', closeSuggestions);
        if (overlay) overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeSuggestions();
        });
        if (addBtn) addBtn.addEventListener('click', openSuggestionForm);
        if (cancelBtn) cancelBtn.addEventListener('click', closeSuggestionForm);
        if (formOverlay) formOverlay.addEventListener('click', function (e) {
          if (e.target === formOverlay) closeSuggestionForm();
        });
        if (submitBtn) submitBtn.addEventListener('click', submitSuggestion);
      })();

      (function setupKeyboardToggle() {
        const kbSection = keyboard.closest('.keyboard-section') || keyboard.parentElement;
        function applyKeyboardVisibility(show) {
          state.showKeyboard = show;
          kbSection.classList.toggle('hidden', !show);
          keyboardToggle.checked = show;
          showKeyboardChk.checked = show;
        }
        keyboardToggle.addEventListener('change', function () {
          applyKeyboardVisibility(keyboardToggle.checked);
        });
        showKeyboardChk.addEventListener('change', function () {
          applyKeyboardVisibility(showKeyboardChk.checked);
        });
        applyKeyboardVisibility(state.showKeyboard !== false);
      })();
      if (restoreAuthFromStorage()) {
        loadCloudState();
      }
      applyTheme(state.theme);
      applyScale(state.uiScale || 100);
    });
  }

  // ---- Speed test ----
  var ST_TEXTS = {
    ru: [
      'Мой дядя самых честных правил когда не в шутку занемог он уважать себя заставил и лучше выдумать не мог',
      'Все счастливые семьи похожи друг на друга каждая несчастливая семья несчастлива по своему',
      'В человеке должно быть все прекрасно и лицо и одежда и душа и мысли',
      'Скажи ка дядя ведь недаром Москва спаленная пожаром французу отдана',
      'Быть или не быть вот в чем вопрос что благородней духом покоряться пращам и стрелам яростной судьбы',
      'Гроза в двенадцатом году пришла кто тут помог нам озлобление народа Барклай зима иль русский бог',
      'Татьяна верила преданьям простонародной старины и снам и карточным гаданьям и предсказаниям луны',
      'В басне как в жизни нет ничего лишнего все к чему то ведет',
      'Кто с пользою отечеству трудится тот легко с ним не разлучится',
      'Умом Россию не понять аршином общим не измерить у ней особенная стать в Россию можно только верить',
      'Человек создан для счастья как птица для полета',
      'На дне души у каждого человека есть своя маленькая бездонная пропасть',
      'Любите книгу источник знания только знание спасательно только оно может сделать вас духовно сильными',
      'Самое дорогое у человека это жизнь она дается ему один раз и прожить ее надо так чтобы не было мучительно больно',
    ],
    en: [
      'It was the best of times it was the worst of times it was the age of wisdom it was the age of foolishness',
      'To be or not to be that is the question whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune',
      'All happy families are alike each unhappy family is unhappy in its own way',
      'Call me Ishmael some years ago never mind how long precisely having little or no money in my purse',
      'It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife',
      'The only way to have a friend is to be one',
      'In the middle of difficulty lies opportunity',
      'Two roads diverged in a wood and I took the one less traveled by and that has made all the difference',
      'It was a bright cold day in April and the clocks were striking thirteen',
      'Happy families are all alike every unhappy family is unhappy in its own way',
      'The old man and the sea is a story of a man who refuses to give up despite all the hardships',
      'All animals are equal but some animals are more equal than others',
      'It is a far far better thing that I do than I have ever done it is a far far better rest that I go to than I have ever known',
      'The sky above the port was the color of television tuned to a dead channel',
    ],
  };

  var stState = { active: false, text: '', typed: '', startTime: null, timerInterval: null, errors: 0, totalTyped: 0 };

  function stTransform(text, difficulty) {
    text = text.trim();
    if (difficulty === 1) { text = text.toLowerCase().replace(/[^a-zа-яё\s]/g, ''); }
    else if (difficulty === 2) { text = text.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ''); }
    return text.replace(/\s+/g, ' ');
  }

  function stStartTest() {
    var diff = parseInt(document.getElementById('stDifficulty').value);
    var lang = document.getElementById('stLang').value;
    var source = document.getElementById('stSource').value;
    var customText = document.getElementById('stCustomText').value.trim();
    var raw;
    if (source === 'custom' && customText) { raw = customText; }
    else { var texts = ST_TEXTS[lang] || ST_TEXTS.ru; raw = texts[Math.floor(Math.random() * texts.length)]; }
    var text = stTransform(raw, diff);
    if (text.length < 10) { alert('Слишком короткий текст'); return; }
    stState.text = text; stState.typed = ''; stState.errors = 0; stState.totalTyped = 0; stState.active = true; stState.startTime = Date.now();
    document.getElementById('speedTestSetup').classList.add('hidden');
    document.getElementById('speedTestActive').classList.remove('hidden');
    document.getElementById('speedTestResult').classList.add('hidden');
    var el = document.getElementById('stTextDisplay');
    var html = '';
    for (var i = 0; i < text.length; i++) { var ch = text[i]; html += '<span class="st-char" data-idx="' + i + '">' + (ch === ' ' ? '&nbsp;' : escHtml(ch)) + '</span>'; }
    el.innerHTML = html;
    document.getElementById('stInput').value = '';
    document.getElementById('stInput').focus();
    if (stState.timerInterval) clearInterval(stState.timerInterval);
    stState.timerInterval = setInterval(function () {
      if (!stState.active) return;
      var elapsed = (Date.now() - stState.startTime) / 1000;
      var speed = stState.totalTyped > 0 ? Math.round((stState.totalTyped - stState.errors) / elapsed * 60) : 0;
      var accuracy = stState.totalTyped > 0 ? Math.round((1 - stState.errors / stState.totalTyped) * 100) : 100;
      document.getElementById('stTime').textContent = Math.floor(elapsed);
      document.getElementById('stSpeed').textContent = speed;
      document.getElementById('stAccuracy').textContent = Math.min(accuracy, 100);
      document.getElementById('stProgress').textContent = Math.min(Math.round(stState.totalTyped / text.length * 100), 100);
    }, 200);
  }

  function stFinishTest() {
    if (!stState.active) return;
    stState.active = false;
    if (stState.timerInterval) { clearInterval(stState.timerInterval); stState.timerInterval = null; }
    var elapsed = (Date.now() - stState.startTime) / 1000;
    var total = stState.totalTyped || stState.text.length;
    var speed = Math.round((total - stState.errors) / elapsed * 60);
    var accuracy = Math.round((1 - stState.errors / total) * 100);
    document.getElementById('speedTestActive').classList.add('hidden');
    document.getElementById('speedTestResult').classList.remove('hidden');
    document.getElementById('stResultSpeed').textContent = speed;
    document.getElementById('stResultAccuracy').textContent = Math.min(accuracy, 100);
    document.getElementById('stResultChars').textContent = total;
    document.getElementById('stResultTime').textContent = Math.floor(elapsed);
    stState._lastResult = { speed: speed, accuracy: Math.min(accuracy, 100), total_chars: total, difficulty: parseInt(document.getElementById('stDifficulty').value), language: document.getElementById('stLang').value };
  }

  // Error counting in speed test input
  var _stInputHandler = function (e) {
    if (e.target.id !== 'stInput' || !stState.active) return;
    var val = e.target.value;
    var text = stState.text;
    stState.typed = val; stState.totalTyped = val.length; stState.errors = 0;
    var chars = document.querySelectorAll('#stTextDisplay .st-char');
    for (var i = 0; i < chars.length; i++) {
      chars[i].className = 'st-char';
      if (i < val.length) { if (val[i] === text[i]) { chars[i].classList.add('st-correct'); } else { chars[i].classList.add('st-incorrect'); if (i === val.length - 1) stState.errors++; } }
    }
    if (val.length > 0 && val.length <= chars.length) { chars[Math.min(val.length, chars.length - 1)].classList.add('st-current'); }
    if (val.length >= text.length) stFinishTest();
  };
  document.addEventListener('input', _stInputHandler);

  // Speed test UI events
  document.addEventListener('change', function (e) {
    if (e.target.id === 'stSource') { document.getElementById('stCustomText').classList.toggle('hidden', e.target.value !== 'custom'); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.id === 'speedTestBtn') {
      document.querySelector('.main-layout').classList.toggle('hidden');
      document.getElementById('speedTestPanel').classList.toggle('hidden');
      document.getElementById('speedTestSetup').classList.remove('hidden');
      document.getElementById('speedTestActive').classList.add('hidden');
      document.getElementById('speedTestResult').classList.add('hidden');
      if (stState.timerInterval) { clearInterval(stState.timerInterval); stState.timerInterval = null; }
      stState.active = false;
    }
    if (e.target.id === 'speedTestCloseBtn') {
      document.getElementById('speedTestPanel').classList.add('hidden');
      document.querySelector('.main-layout').classList.remove('hidden');
      if (stState.timerInterval) { clearInterval(stState.timerInterval); stState.timerInterval = null; }
      stState.active = false;
    }
    if (e.target.id === 'stStartBtn') stStartTest();
    if (e.target.id === 'stFinishBtn') stFinishTest();
    if (e.target.id === 'stRetryBtn') { document.getElementById('speedTestResult').classList.add('hidden'); document.getElementById('speedTestSetup').classList.remove('hidden'); }
    if (e.target.id === 'stSubmitBtn') {
      if (!authToken) { showAuthOverlay(); return; }
      var r = stState._lastResult;
      if (!r) return;
      apiCall('/api/leaderboard/submit', { token: authToken, language: r.language, speed: r.speed, accuracy: r.accuracy, total_chars: r.total_chars, difficulty: r.difficulty }).then(function (res) {
        if (res.error) { alert(res.error); return; }
        alert('Результат отправлен в таблицу лидеров!');
        document.getElementById('speedTestResult').classList.add('hidden');
        document.getElementById('speedTestSetup').classList.remove('hidden');
      });
    }
  });

  // Leaderboard difficulty tabs
  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-lb-diff')) {
      document.querySelectorAll('[data-lb-diff]').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      renderLeaderboard();
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
