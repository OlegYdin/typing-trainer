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

  const AUTH_KEY = 'typingTrainerUsers';

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

  const COURSE_DATA = {
    en: {
      gridCells: [
        { id: 'pres-aff', tense: 'Present Simple', type: 'утверждение', row: 0, col: 0 },
        { id: 'pres-neg', tense: 'Present Simple', type: 'отрицание', row: 0, col: 1 },
        { id: 'pres-ques', tense: 'Present Simple', type: 'вопрос', row: 0, col: 2 },
        { id: 'past-aff', tense: 'Past Simple', type: 'утверждение', row: 1, col: 0 },
        { id: 'past-neg', tense: 'Past Simple', type: 'отрицание', row: 1, col: 1 },
        { id: 'past-ques', tense: 'Past Simple', type: 'вопрос', row: 1, col: 2 },
        { id: 'fut-aff', tense: 'Future Simple', type: 'утверждение', row: 2, col: 0 },
        { id: 'fut-neg', tense: 'Future Simple', type: 'отрицание', row: 2, col: 1 },
        { id: 'fut-ques', tense: 'Future Simple', type: 'вопрос', row: 2, col: 2 },
      ],
      levels: [
        {
          id: 'A1', name: 'Начальный',
          // Cells in order of progression (0-8)
          units: [
            // ── Unit 1: Present Simple, Affirmative ──
            {
              cellId: 'pres-aff',
              theory: '<h3>Present Simple. Утверждение</h3>' +
                '<p>В настоящем простом времени (Present Simple) мы говорим о фактах, привычках и регулярных действиях.</p>' +
                '<p>Формула: <strong>Подлежащее + глагол</strong></p>' +
                '<div class="example">I work every day. — Я работаю каждый день.</div>' +
                '<div class="example">He reads books. — Он читает книги.</div>' +
                '<p>Важно: с he / she / it к глаголу добавляется окончание <strong>-s</strong> или <strong>-es</strong>.</p>',
              blocks: [
                {
                  type: 'translate', label: 'Перевод',
                  pool: [
                    { prompt: 'Я работаю', answer: 'I work' },
                    { prompt: 'Он читает', answer: 'He reads' },
                    { prompt: 'Она пишет', answer: 'She writes' },
                    { prompt: 'Они играют', answer: 'They play' },
                    { prompt: 'Мы живём', answer: 'We live' },
                    { prompt: 'Ты говоришь', answer: 'You speak' },
                    { prompt: 'Кот спит', answer: 'The cat sleeps' },
                    { prompt: 'Собака бегает', answer: 'The dog runs' },
                    { prompt: 'Дети учатся', answer: 'Children learn' },
                    { prompt: 'Солнце светит', answer: 'The sun shines' },
                    { prompt: 'Она готовит ужин', answer: 'She cooks dinner' },
                    { prompt: 'Он водит машину', answer: 'He drives a car' },
                    { prompt: 'Мы смотрим телевизор', answer: 'We watch TV' },
                    { prompt: 'Птицы поют', answer: 'Birds sing' },
                  ],
                },
                {
                  type: 'build', label: 'Сборка',
                  pool: [
                    { prompt: 'Я работаю каждый день', answer: 'I work every day' },
                    { prompt: 'Он читает книги', answer: 'He reads books' },
                    { prompt: 'Она пишет письмо', answer: 'She writes a letter' },
                    { prompt: 'Они играют в футбол', answer: 'They play football' },
                    { prompt: 'Мы живём в Лондоне', answer: 'We live in London' },
                    { prompt: 'Ты говоришь по-английски', answer: 'You speak English' },
                    { prompt: 'Кот спит на диване', answer: 'The cat sleeps on the sofa' },
                    { prompt: 'Собака бегает в парке', answer: 'The dog runs in the park' },
                    { prompt: 'Солнце светит ярко', answer: 'The sun shines brightly' },
                    { prompt: 'Она готовит ужин', answer: 'She cooks dinner' },
                    { prompt: 'Он водит машину', answer: 'He drives a car' },
                    { prompt: 'Мы смотрим телевизор', answer: 'We watch TV' },
                    { prompt: 'Они слушают музыку', answer: 'They listen to music' },
                    { prompt: 'Птицы поют утром', answer: 'Birds sing in the morning' },
                  ],
                },
                {
                  type: 'fill_gap', label: 'Вставка',
                  pool: [
                    { prompt: 'I ___ every day.', answer: 'work', hint: 'work' },
                    { prompt: 'He ___ books.', answer: 'reads', hint: 'read' },
                    { prompt: 'She ___ a letter.', answer: 'writes', hint: 'write' },
                    { prompt: 'They ___ football.', answer: 'play', hint: 'play' },
                    { prompt: 'We ___ in London.', answer: 'live', hint: 'live' },
                    { prompt: 'You ___ English.', answer: 'speak', hint: 'speak' },
                    { prompt: 'The cat ___ on the sofa.', answer: 'sleeps', hint: 'sleep' },
                    { prompt: 'The dog ___ in the park.', answer: 'runs', hint: 'run' },
                    { prompt: 'The sun ___ brightly.', answer: 'shines', hint: 'shine' },
                    { prompt: 'She ___ dinner.', answer: 'cooks', hint: 'cook' },
                    { prompt: 'He ___ a car.', answer: 'drives', hint: 'drive' },
                    { prompt: 'Birds ___ in the morning.', answer: 'sing', hint: 'sing' },
                  ],
                },
                {
                  type: 'choice', label: 'Выбор формы',
                  pool: [
                    { prompt: 'He ___ coffee. a) drink  b) drinks', answer: 'drinks' },
                    { prompt: 'They ___ tea. a) like  b) likes', answer: 'like' },
                    { prompt: 'She ___ English. a) speak  b) speaks', answer: 'speaks' },
                    { prompt: 'I ___ to music. a) listen  b) listens', answer: 'listen' },
                    { prompt: 'The dog ___ fast. a) run  b) runs', answer: 'runs' },
                    { prompt: 'Birds ___ high. a) fly  b) flies', answer: 'fly' },
                    { prompt: 'He ___ books. a) read  b) reads', answer: 'reads' },
                    { prompt: 'We ___ TV. a) watch  b) watches', answer: 'watch' },
                    { prompt: 'She ___ dinner. a) cook  b) cooks', answer: 'cooks' },
                    { prompt: 'They ___ football. a) play  b) plays', answer: 'play' },
                  ],
                },
              ],
            },
            // ── Unit 2: Present Simple, Negative ──
            {
              cellId: 'pres-neg',
              theory: '<h3>Present Simple. Отрицание</h3>' +
                '<p>Для отрицания используем вспомогательный глагол <strong>do</strong> (I / you / we / they) или <strong>does</strong> (he / she / it) + частицу <strong>not</strong>.</p>' +
                '<p>Формула: <strong>Подлежащее + do/does + not + глагол</strong></p>' +
                '<div class="example">I do not (don\'t) work. — Я не работаю.</div>' +
                '<div class="example">He does not (doesn\'t) read. — Он не читает.</div>' +
                '<p>Обрати внимание: после does глагол возвращается в начальную форму (без -s).</p>',
              blocks: [
                {
                  type: 'translate', label: 'Перевод',
                  pool: [
                    { prompt: 'Я не работаю', answer: "I don't work" },
                    { prompt: 'Он не читает', answer: "He doesn't read" },
                    { prompt: 'Она не пишет', answer: "She doesn't write" },
                    { prompt: 'Они не играют', answer: "They don't play" },
                    { prompt: 'Мы не живём здесь', answer: "We don't live here" },
                    { prompt: 'Кот не спит', answer: "The cat doesn't sleep" },
                    { prompt: 'Собака не бегает', answer: "The dog doesn't run" },
                    { prompt: 'Я не люблю кофе', answer: "I don't like coffee" },
                    { prompt: 'Она не готовит мясо', answer: "She doesn't cook meat" },
                    { prompt: 'Он не водит автобус', answer: "He doesn't drive a bus" },
                    { prompt: 'Мы не смотрим ужастики', answer: "We don't watch horror films" },
                    { prompt: 'Птицы не поют ночью', answer: "Birds don't sing at night" },
                    { prompt: 'Ты не говоришь по-французски', answer: "You don't speak French" },
                    { prompt: 'Дети не учат китайский', answer: "Children don't learn Chinese" },
                  ],
                },
                {
                  type: 'build', label: 'Сборка',
                  pool: [
                    { prompt: 'Я не работаю в воскресенье', answer: "I don't work on Sunday" },
                    { prompt: 'Он не читает книги', answer: "He doesn't read books" },
                    { prompt: 'Она не пишет письма', answer: "She doesn't write letters" },
                    { prompt: 'Они не играют в футбол', answer: "They don't play football" },
                    { prompt: 'Мы не живём в Лондоне', answer: "We don't live in London" },
                    { prompt: 'Ты не говоришь по-французски', answer: "You don't speak French" },
                    { prompt: 'Кот не спит здесь', answer: "The cat doesn't sleep here" },
                    { prompt: 'Собака не бегает быстро', answer: "The dog doesn't run fast" },
                    { prompt: 'Она не готовит мясо', answer: "She doesn't cook meat" },
                    { prompt: 'Он не водит автобус', answer: "He doesn't drive a bus" },
                    { prompt: 'Птицы не поют ночью', answer: "Birds don't sing at night" },
                  ],
                },
                {
                  type: 'fill_gap', label: 'Вставка',
                  pool: [
                    { prompt: 'I ___ on Sunday.', answer: "don't work", hint: 'not work' },
                    { prompt: 'He ___ books.', answer: "doesn't read", hint: 'not read' },
                    { prompt: 'She ___ letters.', answer: "doesn't write", hint: 'not write' },
                    { prompt: 'They ___ football.', answer: "don't play", hint: 'not play' },
                    { prompt: 'We ___ in London.', answer: "don't live", hint: 'not live' },
                    { prompt: 'The cat ___ here.', answer: "doesn't sleep", hint: 'not sleep' },
                    { prompt: 'The dog ___ fast.', answer: "doesn't run", hint: 'not run' },
                    { prompt: 'She ___ meat.', answer: "doesn't cook", hint: 'not cook' },
                    { prompt: 'He ___ a bus.', answer: "doesn't drive", hint: 'not drive' },
                    { prompt: 'Birds ___ at night.', answer: "don't sing", hint: 'not sing' },
                  ],
                },
                {
                  type: 'choice', label: 'Выбор формы',
                  pool: [
                    { prompt: 'I ___ coffee. a) don\'t like  b) doesn\'t like', answer: "don't like" },
                    { prompt: 'He ___ books. a) don\'t read  b) doesn\'t read', answer: "doesn't read" },
                    { prompt: 'She ___ letters. a) don\'t write  b) doesn\'t write', answer: "doesn't write" },
                    { prompt: 'They ___ football. a) don\'t play  b) doesn\'t play', answer: "don't play" },
                    { prompt: 'We ___ here. a) don\'t live  b) doesn\'t live', answer: "don't live" },
                    { prompt: 'The cat ___ here. a) don\'t sleep  b) doesn\'t sleep', answer: "doesn't sleep" },
                    { prompt: 'The dog ___ fast. a) don\'t run  b) doesn\'t run', answer: "doesn't run" },
                    { prompt: 'She ___ meat. a) don\'t cook  b) doesn\'t cook', answer: "doesn't cook" },
                    { prompt: 'Birds ___ at night. a) don\'t sing  b) doesn\'t sing', answer: "don't sing" },
                  ],
                },
              ],
            },
            // ── Unit 3: Present Simple, Question ──
            {
              cellId: 'pres-ques',
              theory: '<h3>Present Simple. Вопрос</h3>' +
                '<p>Для вопроса ставим <strong>Do</strong> или <strong>Does</strong> в начало предложения.</p>' +
                '<p>Формула: <strong>Do/Does + подлежащее + глагол?</strong></p>' +
                '<div class="example">Do you work? — Ты работаешь?</div>' +
                '<div class="example">Does he read? — Он читает?</div>' +
                '<p>После does глагол без -s. На такие вопросы отвечаем: <em>Yes, I do</em> / <em>No, he doesn\'t</em>.</p>',
              blocks: [
                {
                  type: 'translate', label: 'Перевод',
                  pool: [
                    { prompt: 'Ты работаешь?', answer: 'Do you work' },
                    { prompt: 'Он читает?', answer: 'Does he read' },
                    { prompt: 'Она пишет?', answer: 'Does she write' },
                    { prompt: 'Они играют?', answer: 'Do they play' },
                    { prompt: 'Вы говорите по-английски?', answer: 'Do you speak English' },
                    { prompt: 'Кот спит?', answer: 'Does the cat sleep' },
                    { prompt: 'Собака бегает?', answer: 'Does the dog run' },
                    { prompt: 'Ты любишь кофе?', answer: 'Do you like coffee' },
                    { prompt: 'Она готовит ужин?', answer: 'Does she cook dinner' },
                    { prompt: 'Он водит машину?', answer: 'Does he drive a car' },
                    { prompt: 'Мы смотрим телевизор?', answer: 'Do we watch TV' },
                    { prompt: 'Птицы поют?', answer: 'Do birds sing' },
                    { prompt: 'Дети учатся в школе?', answer: 'Do children learn at school' },
                  ],
                },
                {
                  type: 'build', label: 'Сборка',
                  pool: [
                    { prompt: 'Ты работаешь каждый день?', answer: 'Do you work every day' },
                    { prompt: 'Он читает книги?', answer: 'Does he read books' },
                    { prompt: 'Она пишет письма?', answer: 'Does she write letters' },
                    { prompt: 'Они играют в футбол?', answer: 'Do they play football' },
                    { prompt: 'Ты говоришь по-английски?', answer: 'Do you speak English' },
                    { prompt: 'Кот спит здесь?', answer: 'Does the cat sleep here' },
                    { prompt: 'Собака бегает быстро?', answer: 'Does the dog run fast' },
                    { prompt: 'Ты любишь кофе?', answer: 'Do you like coffee' },
                    { prompt: 'Она готовит ужин?', answer: 'Does she cook dinner' },
                    { prompt: 'Он водит машину?', answer: 'Does he drive a car' },
                    { prompt: 'Птицы поют утром?', answer: 'Do birds sing in the morning' },
                  ],
                },
                {
                  type: 'fill_gap', label: 'Вставка',
                  pool: [
                    { prompt: '___ you work every day?', answer: 'Do', hint: 'Do / Does' },
                    { prompt: '___ he read books?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ she write letters?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ they play football?', answer: 'Do', hint: 'Do / Does' },
                    { prompt: '___ you speak English?', answer: 'Do', hint: 'Do / Does' },
                    { prompt: '___ the cat sleep here?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ the dog run fast?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ you like coffee?', answer: 'Do', hint: 'Do / Does' },
                    { prompt: '___ she cook dinner?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ he drive a car?', answer: 'Does', hint: 'Do / Does' },
                    { prompt: '___ birds sing in the morning?', answer: 'Do', hint: 'Do / Does' },
                  ],
                },
                {
                  type: 'choice', label: 'Выбор формы',
                  pool: [
                    { prompt: '___ you work? a) Do  b) Does', answer: 'Do' },
                    { prompt: '___ he read? a) Do  b) Does', answer: 'Does' },
                    { prompt: '___ she write? a) Do  b) Does', answer: 'Does' },
                    { prompt: '___ they play? a) Do  b) Does', answer: 'Do' },
                    { prompt: '___ it rain here? a) Do  b) Does', answer: 'Does' },
                    { prompt: '___ we go? a) Do  b) Does', answer: 'Do' },
                  ],
                },
              ],
            },
          ],
        },
        // A2 and B1 can be added later with more grid cells
      ],
    },
  };

  function initExercises() {
    if (typeof COURSE_EXERCISES === 'undefined') return;
    var levels = COURSE_DATA.en.levels;
    for (var li = 0; li < levels.length; li++) {
      var units = levels[li].units;
      for (var ui = 0; ui < units.length; ui++) {
        var unit = units[ui];
        var blocks = unit.blocks;
        for (var bi = 0; bi < blocks.length; bi++) {
          var block = blocks[bi];
          var key = unit.cellId + '-' + block.type;
          if (COURSE_EXERCISES[key]) {
            block.pool = COURSE_EXERCISES[key];
          }
        }
      }
    }
  }

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
      courseActive: false,
      courseLevel: 0,
      courseUnit: 0,
      courseBlock: 0,
      courseBlockExIdx: 0,
      courseBlockExOrder: [],
      courseBlockPool: [],
      courseBlockCount: 0,
      courseHidePrompt: false,
      courseTheoryRead: false,
      courseDataVersion: 4,
      courseLevelCompleted: -1,
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
      sessionTimeout: 30,
      showKeyboard: true,
      courseIgnoreCase: true,
      courseIgnorePunct: true,
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
  let authUsers = {};
  let authCurrentUser = null;

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
  const lrSpeed = document.getElementById('lrSpeed');
  const lrSpeedDelta = document.getElementById('lrSpeedDelta');
  const lrAccuracy = document.getElementById('lrAccuracy');
  const lrAccuracyDelta = document.getElementById('lrAccuracyDelta');
  const lrEmpty = document.getElementById('lrEmpty');
  const lastResultBody = document.getElementById('lastResultBody');
  const textLengthInput = document.getElementById('textLengthInput');
  const scaleInput = document.getElementById('scaleInput');
  const scaleLabel = document.getElementById('scaleLabel');
  const keyboardToggle = document.getElementById('keyboardToggle');
  const showKeyboardChk = document.getElementById('showKeyboardChk');
  const authOverlay = document.getElementById('authOverlay');
  const authNameInput = document.getElementById('authNameInput');
  const authPhraseInput = document.getElementById('authPhraseInput');
  const authPhraseCounter = document.getElementById('authPhraseCounter');
  const authLoginBtn = document.getElementById('authLoginBtn');
  const authRegisterBtn = document.getElementById('authRegisterBtn');
  const authMsg = document.getElementById('authMsg');
  const switchUserBtn = document.getElementById('switchUserBtn');
  const authMigrateNotice = document.getElementById('authMigrateNotice');
  const authUserInfo = document.getElementById('authUserInfo');
  const authCurrentUserName = document.getElementById('authCurrentUserName');
  const authLogoutBtn = document.getElementById('authLogoutBtn');
  const sessionTimeoutInput = document.getElementById('sessionTimeoutInput');
  const modeToggleBtn = document.getElementById('modeToggleBtn');
  const courseLevelDisplay = document.getElementById('courseLevelDisplay');
  const mainTitle = document.getElementById('mainTitle');
  const nextLetterHint = document.getElementById('nextLetterHint');
  const courseArea = document.getElementById('courseArea');
  const courseQuestion = document.getElementById('courseQuestion');
  const courseFeedback = document.getElementById('courseFeedback');
  const courseInput = document.getElementById('courseInput');
  const courseSubmit = document.getElementById('courseSubmit');
  const courseNext = document.getElementById('courseNext');
  const courseWords = document.getElementById('courseWords');
  const courseIgnoreCaseChk = document.getElementById('courseIgnoreCase');
  const courseIgnorePunctChk = document.getElementById('courseIgnorePunct');
  const courseIgnoreCaseQuick = document.getElementById('courseIgnoreCaseQuick');
  const courseIgnorePunctQuick = document.getElementById('courseIgnorePunctQuick');
  const courseTheory = document.getElementById('courseTheory');
  const courseTheoryBtn = document.getElementById('courseTheoryBtn');
  const courseCountSelector = document.getElementById('courseCountSelector');
  const courseHidePromptChk = document.getElementById('courseHidePrompt');
  const speedStat = document.getElementById('speedStat');
  const accuracyStat = document.getElementById('accuracyStat');
  const targetSpeedItem = document.getElementById('targetSpeedItem');
  const targetAccuracyItem = document.getElementById('targetAccuracyItem');
  const lastResultCard = document.getElementById('lastResultCard');
  const courseProgress = document.getElementById('courseProgress');
  const courseProgressBar = document.getElementById('courseProgressBar');
  const courseProgressText = document.getElementById('courseProgressText');
  const sideCardTitle = document.getElementById('sideCardTitle');
  const sideCardLabel = document.getElementById('sideCardLabel');
  const sideCardSub = document.getElementById('sideCardSub');
  const sidePanel = document.querySelector('.side-panel');
  const lessonStat = document.getElementById('lessonStat');

  function populateLangSelect(courseOnly) {
    langSelect.innerHTML = '';
    for (const key of Object.keys(LANG_DATA)) {
      if (courseOnly && !COURSE_DATA[key]) continue;
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

  function isCourseMode() {
    const c = cur();
    return c.courseActive && COURSE_DATA[state.language] &&
      c.courseLevel < COURSE_DATA[state.language].levels.length;
  }
  window.isCourseMode = isCourseMode;

  function getCurrentLevel() {
    if (!isCourseMode()) return null;
    return COURSE_DATA[state.language].levels[cur().courseLevel];
  }
  window.getCurrentLevel = getCurrentLevel;

  function getCurrentUnit() {
    const level = getCurrentLevel();
    if (!level) return null;
    const c = cur();
    if (c.courseUnit >= level.units.length) return null;
    return level.units[c.courseUnit];
  }

  function getCurrentBlock() {
    const unit = getCurrentUnit();
    if (!unit) return null;
    const c = cur();
    if (c.courseBlock >= unit.blocks.length) return null;
    return unit.blocks[c.courseBlock];
  }

  function getGridCell(cellId) {
    const grid = COURSE_DATA[state.language] && COURSE_DATA[state.language].gridCells;
    if (!grid) return null;
    return grid.find(c => c.id === cellId) || null;
  }

  let courseExIdx = 0;
  let courseExOrder = [];
  // Course runtime state
  let courseBlockPool = [];

  function shuffleArr(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function renderCourseExercise() {
    const unit = getCurrentUnit();
    const block = getCurrentBlock();
    const c = cur();
    if (!unit || !block) return;

    const exs = courseBlockPool;
    const idx = c.courseBlockExIdx;
    if (idx >= exs.length) {
      // Block finished — advance to next block
      c.courseBlock++;
      c.courseBlockExIdx = 0;
      c.courseBlockExOrder = [];
      c.courseBlockPool = [];
      courseBlockPool = [];
      saveState();
      renderCourseContent();
      return;
    }

    const ex = exs[idx];
    const gridCell = getGridCell(unit.cellId);
    const cellLabel = gridCell ? gridCell.tense + ' · ' + gridCell.type : '';

    // Build question display
    let html = '';
    const hidePrompt = c.courseHidePrompt || false;
    if (block.type === 'translate') {
      html = '<div style="font-size:0.85rem;opacity:0.5;margin-bottom:4px">Переведи на английский</div>';
      html += '<div style="font-size:1.5rem">' + ex.prompt + '</div>';
    } else if (block.type === 'build') {
      html = '<div style="font-size:0.85rem;opacity:0.5;margin-bottom:4px">Собери предложение</div>';
      html += '<div style="font-size:1.5rem">' + ex.prompt + '</div>';
    } else if (block.type === 'fill_gap') {
      html = '<div style="font-size:0.85rem;opacity:0.5;margin-bottom:4px">Вставь пропущенное слово</div>';
      html += '<div style="font-size:1.5rem">' + ex.prompt + '</div>';
    } else if (block.type === 'choice') {
      html = '<div style="font-size:0.85rem;opacity:0.5;margin-bottom:4px">Выбери правильную форму</div>';
      html += '<div style="font-size:1.5rem">' + ex.prompt + '</div>';
    }

    // Word chips as hints (from answer for all types)
    if (!hidePrompt) {
      const words = ex.answer.split(/\s+/).filter(w => w.length > 0);
      const unique = [];
      const seen = {};
      for (const w of words) {
        const key = w.replace(/[.,!?;:'"()\[\]{}\-]/g, '').toLowerCase();
        if (key && !seen[key]) {
          seen[key] = true;
          unique.push(w);
        }
      }
      if (unique.length > 1) {
        const shuffled = shuffleArr(unique.slice());
        courseWords.innerHTML = shuffled.map(w => '<span class="course-word-chip">' + w + '</span>').join(' ');
      } else {
        courseWords.innerHTML = '';
      }
    } else {
      courseWords.innerHTML = '';
    }

    if (ex.hint) {
      html += '<div style="margin-top:8px;font-size:0.85rem;opacity:0.5">💡 ' + ex.hint + '</div>';
    }

    courseQuestion.innerHTML = html;
    courseFeedback.style.display = 'none';
    courseFeedback.className = 'course-feedback';
    courseInput.value = '';
    courseInput.className = 'course-input';
    courseInput.readOnly = false;
    courseInput.disabled = false;
    courseInput.focus();
    courseSubmit.disabled = false;
    courseSubmit.textContent = 'Проверить';
    courseNext.style.display = 'none';
    courseIgnoreCaseQuick.checked = state.courseIgnoreCase !== false;
    courseIgnorePunctQuick.checked = state.courseIgnorePunct !== false;
    courseHidePromptChk.checked = c.courseHidePrompt || false;
    // Update progress bar
    courseProgress.style.display = 'flex';
    courseProgressBar.style.width = ((idx + 1) / exs.length * 100) + '%';
    courseProgressText.textContent = (idx + 1) + '/' + exs.length;
    updateCourseKeyboard();
    updateStats();
    updateCourseDisplay();
  }

  function renderCourseContent() {
    const level = getCurrentLevel();
    const unit = getCurrentUnit();
    const block = getCurrentBlock();
    const c = cur();

    if (!level) {
      // No more levels — done
      c.courseActive = false;
      saveState();
      showModal('Курс пройден!', 'Вы завершили все уровни!');
      renderText();
      return;
    }

    if (!unit) {
      // No more units in this level — mark completed, go to next level
      if (c.courseLevel > c.courseLevelCompleted) c.courseLevelCompleted = c.courseLevel;
      c.courseLevel++;
      c.courseUnit = 0;
      c.courseBlock = 0;
      c.courseBlockExIdx = 0;
      c.courseBlockExOrder = [];
      c.courseBlockPool = [];
      c.courseTheoryRead = false;
      courseBlockPool = [];
      saveState();
      if (c.courseLevel >= COURSE_DATA[state.language].levels.length) {
        c.courseActive = false;
        saveState();
        showModal('Курс пройден!', 'Вы завершили все уровни!');
        renderText();
        return;
      }
      const nextLevel = COURSE_DATA[state.language].levels[c.courseLevel];
      showModal('Уровень ' + level.id + ' пройден!',
        'Переходим к уровню <strong>' + nextLevel.id + ' — ' + nextLevel.name + '</strong>');
      renderLetters();
      updateStats();
      updateCourseDisplay();
      renderCourseContent();
      return;
    }

    if (!block) {
      // No more blocks in this unit — next unit
      c.courseUnit++;
      c.courseBlock = 0;
      c.courseBlockExIdx = 0;
      c.courseBlockExOrder = [];
      c.courseBlockPool = [];
      courseBlockPool = [];
      c.courseTheoryRead = false;
      saveState();
      renderCourseContent();
      return;
    }

    // Show theory first if not read
    if (!c.courseTheoryRead) {
      courseProgress.style.display = 'none';
      updateCourseKeyboard();
      courseQuestion.style.display = 'none';
      courseInput.style.display = 'none';
      courseSubmit.style.display = 'none';
      courseNext.style.display = 'none';
      courseCountSelector.style.display = 'none';
      courseWords.style.display = 'none';
      courseTheory.style.display = 'block';

      const gridCell = getGridCell(unit.cellId);
      let theoryHtml = '';
      if (gridCell) {
        theoryHtml = '<div style="font-size:0.85rem;opacity:0.5;margin-bottom:8px">' +
          gridCell.tense + ' · ' + gridCell.type + ' → ' + block.label + '</div>';
      }
      theoryHtml += unit.theory;
      courseTheory.innerHTML = theoryHtml;
      courseTheoryBtn.style.display = '';
      return;
    }

    // Show count selector if this is the first exercise in the block
    if (c.courseBlockExIdx === 0 && !courseBlockPool.length) {
      // If we have a saved pool from a previous session, restore it
      if (c.courseBlockPool && c.courseBlockPool.length) {
        courseBlockPool = c.courseBlockPool;
      } else {
        courseProgress.style.display = 'none';
        updateCourseKeyboard();
        courseTheory.style.display = 'none';
        courseTheoryBtn.style.display = 'none';
        courseQuestion.style.display = 'none';
        courseInput.style.display = 'none';
        courseSubmit.style.display = 'none';
        courseNext.style.display = 'none';
        courseWords.style.display = 'none';
        courseCountSelector.style.display = 'flex';

        const gridCell = getGridCell(unit.cellId);
        courseCountSelector.innerHTML = '<span style="margin-right:8px">' +
          block.label + ' — сколько примеров:</span>' +
          '<button class="btn-sm" data-count="10">10</button>' +
          '<button class="btn-sm" data-count="20">20</button>' +
          '<button class="btn-sm" data-count="30">30</button>' +
          '<button class="btn-sm" data-count="0">Все (' + block.pool.length + ')</button>';

        const prevCount = c.courseBlockCount || 0;
        courseCountSelector.querySelectorAll('.btn-sm').forEach(function (btn) {
          if (parseInt(btn.dataset.count) === prevCount) btn.classList.add('active');
          btn.addEventListener('click', function () {
            const chosen = parseInt(this.dataset.count);
            startCourseBlock(chosen);
          });
        });
        return;
      }
    }

    // Show exercise
    courseTheory.style.display = 'none';
    courseTheoryBtn.style.display = 'none';
    courseCountSelector.style.display = 'none';
    courseQuestion.style.display = '';
    courseInput.style.display = '';
    courseSubmit.style.display = '';
    courseWords.style.display = '';
    renderCourseExercise();
  }

  function startCourseBlock(chosenCount) {
    const block = getCurrentBlock();
    const c = cur();
    if (!block) return;

    const pool = block.pool;
    const count = chosenCount === 0 ? pool.length : chosenCount;

    c.courseBlockCount = chosenCount;
    const shuffled = shuffleArr(pool.slice());
    const selected = [];
    while (selected.length < count) {
      for (const ex of shuffled) {
        if (selected.length >= count) break;
        selected.push(ex);
      }
    }
    courseBlockPool = selected;
    c.courseBlockPool = selected;
    c.courseBlockExOrder = selected.map(function (_, i) { return i; });
    c.courseBlockExIdx = 0;
    c.courseBlockExIdx = 0;
    saveState();

    renderCourseContent();
  }

  function normalizeAnswer(str, ignoreCase, ignorePunct) {
    let s = str.trim();
    if (ignorePunct) {
      s = s.replace(/[.,!?;:'"()\[\]{}\-]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (ignoreCase) {
      s = s.toLowerCase();
    }
    return s;
  }

  function checkAnswer() {
    const block = getCurrentBlock();
    const c = cur();
    if (!block) return;
    const exs = courseBlockPool;
    const idx = c.courseBlockExIdx;
    if (idx >= exs.length) return;
    const ex = exs[idx];
    const ignoreCase = state.courseIgnoreCase !== false;
    const ignorePunct = state.courseIgnorePunct !== false;
    const user = normalizeAnswer(courseInput.value, ignoreCase, ignorePunct);
    const correct = normalizeAnswer(ex.answer, ignoreCase, ignorePunct);
    if (user === correct) {
      courseFeedback.textContent = '✅ Верно!';
      courseFeedback.className = 'course-feedback correct';
      courseInput.className = 'course-input correct';
      courseInput.readOnly = true;
      courseSubmit.disabled = true;
      courseNext.style.display = '';
      saveState();
    } else {
      courseFeedback.innerHTML = '❌ Неверно. Правильный ответ: <strong>' + ex.answer + '</strong>';
      courseFeedback.className = 'course-feedback incorrect';
      courseInput.className = 'course-input incorrect';
      courseInput.readOnly = false;
      courseInput.disabled = false;
      courseSubmit.disabled = false;
      courseInput.focus();
      courseInput.select();
    }
    courseFeedback.style.display = '';
  }

  courseSubmit.addEventListener('click', checkAnswer);
  courseInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      if (courseNext.style.display !== 'none') {
        courseNext.click();
      } else {
        checkAnswer();
      }
    }
  });
  courseInput.addEventListener('input', updateCourseKeyboard);
  courseNext.addEventListener('click', function () {
    const c = cur();
    c.courseBlockExIdx++;
    saveState();
    renderCourseContent();
  });
  courseTheoryBtn.addEventListener('click', function () {
    const c = cur();
    c.courseTheoryRead = true;
    saveState();
    renderCourseContent();
  });
  courseHidePromptChk.addEventListener('change', function () {
    const c = cur();
    c.courseHidePrompt = courseHidePromptChk.checked;
    saveState();
    renderCourseExercise();
  });
  courseIgnoreCaseQuick.addEventListener('change', function () {
    state.courseIgnoreCase = courseIgnoreCaseQuick.checked;
    courseIgnoreCaseChk.checked = courseIgnoreCaseQuick.checked;
  });
  courseIgnorePunctQuick.addEventListener('change', function () {
    state.courseIgnorePunct = courseIgnorePunctQuick.checked;
    courseIgnorePunctChk.checked = courseIgnorePunctQuick.checked;
  });

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

    const course = isCourseMode();
    if (course) {
      document.querySelector('.practice-area').style.display = 'none';
      courseArea.style.display = 'flex';
      renderCourseContent();
      return;
    }
    document.querySelector('.practice-area').style.display = '';
    courseArea.style.display = 'none';

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
    if (isCourseMode()) {
      lettersGrid.classList.remove('compact');
      unlockedCount.textContent = '';
      totalCount.textContent = '';
      nextLetter.textContent = '';
      nextLetterHint.style.display = 'none';
      const level = getCurrentLevel();
      const c = cur();
      const allLevels = COURSE_DATA[state.language].levels;
      let selHtml = '<select id="courseLevelSelect" style="background:var(--bg-card);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:2px 4px;font-size:0.8rem;max-width:100%">';
      for (let li = 0; li < allLevels.length; li++) {
        const lv = allLevels[li];
        const completed = li <= c.courseLevelCompleted;
        const current = li === c.courseLevel;
        const locked = li > c.courseLevelCompleted + 1;
        const prefix = completed ? '✓ ' : (current ? '▶ ' : '🔒 ');
        selHtml += '<option value="' + li + '"' +
          (current ? ' selected' : '') +
          (locked ? ' disabled' : '') +
          '>' + prefix + lv.id + ' · ' + lv.name + '</option>';
      }
      selHtml += '</select>';
      sideCardLabel.innerHTML = selHtml;
      const sel = sideCardLabel.querySelector('#courseLevelSelect');
      if (sel) {
        sel.addEventListener('change', function () {
          const newLevel = parseInt(sel.value, 10);
          if (newLevel === c.courseLevel) return;
          if (newLevel > c.courseLevelCompleted + 1) return;
          c.courseLevel = newLevel;
          c.courseUnit = 0;
          c.courseBlock = 1;
          c.courseBlockExIdx = 0;
          c.courseBlockPool = [];
          c.courseTheoryRead = false;
          courseBlockPool = [];
          saveState();
          renderLetters();
          renderCourseContent();
        });
      }
      sideCardLabel.title = '';
      sideCardLabel.style.cursor = '';
      sideCardSub.style.display = 'none';
      sidePanel.classList.add('course-active');
      renderCourseGrid();
      return;
    }
    const order = langData().letterOrder;
    lettersGrid.classList.toggle('compact', order.length > 40);
    nextLetterHint.style.display = '';
    sideCardLabel.textContent = 'Буквы';
    sideCardLabel.style.cursor = '';
    sideCardLabel.title = '';
    sideCardSub.style.display = '';
    sidePanel.classList.remove('course-active');
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

  function renderCourseGrid() {
    const level = getCurrentLevel();
    if (!level) return;
    const cells = COURSE_DATA[state.language].gridCells;
    const rowLabels = ['Present Simple', 'Past Simple', 'Future Simple'];
    const colLabels = ['Утверждение', 'Отрицание', 'Вопрос'];

    let html = '<div class="course-grid">';
    for (let r = 0; r < 3; r++) {
      html += '<div class="course-grid-row">';
      for (let c = 0; c < 3; c++) {
        const cell = cells.find(function (g) { return g.row === r && g.col === c; });
        if (!cell) continue;
        const unitIdx = level.units.findIndex(function (u) { return u.cellId === cell.id; });
        let status = 'locked';
        if (unitIdx >= 0) {
          if (unitIdx < cur().courseUnit) status = 'completed';
          else if (unitIdx === cur().courseUnit) status = 'current';
        }
        // Build tree tooltip
        let tree = level.id + ' · ' + rowLabels[r] + ' · ' + colLabels[c];
        if (unitIdx >= 0) {
          const unit = level.units[unitIdx];
          for (let bi = 0; bi < unit.blocks.length; bi++) {
            const b = unit.blocks[bi];
            tree += '\n├─ ' + (bi + 1) + '. ' + b.label + ' (' + b.pool.length + ')';
          }
        }
        html += '<div class="course-grid-cell ' + status + '" title="' + tree.replace(/"/g, '&quot;') + '">' +
          '<span class="cell-label">' + rowLabels[r] + '</span>' +
          '<span class="cell-sub">' + colLabels[c] + '</span>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    lettersGrid.innerHTML = html;
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

  function updateCourseKeyboard() {
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach(k => k.classList.remove('course-key', 'current-key'));
    if (!isCourseMode()) return;
    const exs = courseBlockPool;
    const idx = cur().courseBlockExIdx;
    if (!exs || idx >= exs.length) return;
    const answer = exs[idx].answer;
    // Green highlight: all unique chars in the answer
    const chars = new Set();
    for (const ch of answer.toLowerCase()) {
      if (ch === ' ') continue;
      const mapped = SHIFT_MAP[ch] || ch;
      chars.add(mapped);
    }
    for (const ch of chars) {
      const target = keyboard.querySelector('.key[data-char="' + ch + '"]');
      if (target) target.classList.add('course-key');
    }
    // Blue highlight: next expected character
    const typed = courseInput.value;
    let nextIdx = typed.length;
    while (nextIdx < answer.length && answer[nextIdx] === ' ') nextIdx++;
    if (nextIdx < answer.length) {
      const nextCh = answer[nextIdx].toLowerCase();
      const mapped = SHIFT_MAP[nextCh] || nextCh;
      const target = keyboard.querySelector('.key[data-char="' + mapped + '"]');
      if (target) target.classList.add('current-key');
    }
  }

  function updateProgress() {
    if (textChars.length === 0) return;
    progressBar.style.width = Math.min((currentIndex / textChars.length) * 100, 100) + '%';
  }

  function updateStats() {
    const duration = startTime ? (Date.now() - startTime) / 1000 : 0;
    const typed = totalCorrect + totalErrors;
    const speed = duration > 0 ? Math.round((totalCorrect / duration) * 60) : 0;
    const accuracy = typed > 0 ? Math.round((totalCorrect / typed) * 100) : 100;

    speedDisplay.textContent = speed;
    accuracyDisplay.textContent = accuracy + '%';
    if (isCourseMode()) {
      const block = getCurrentBlock();
      const total = block ? block.pool.length : '—';
      const done = block ? Math.min(cur().courseBlockExIdx + 1, block.pool.length) : 0;
      lessonDisplay.textContent = done + '/' + total;
      streakDisplay.textContent = '';
      lessonStat.style.display = 'none';
      speedStat.style.display = 'none';
      accuracyStat.style.display = 'none';
      streakStat.style.display = 'none';
      targetSpeedItem.style.display = 'none';
      targetAccuracyItem.style.display = 'none';
      targetStreakItem.style.display = 'none';
      lastResultCard.style.display = 'none';
      speedDisplay.textContent = '—';
      accuracyDisplay.textContent = '—';
    } else {
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
    }
    if (inlineEditingTarget !== 'targetSpeed') targetSpeed.textContent = state.speedReq;
    if (inlineEditingTarget !== 'targetAccuracy') targetAccuracy.textContent = Math.round(state.accuracyReq * 100);
    if (inlineEditingTarget !== 'targetStreak') targetStreak.textContent = state.consecutiveReq;
    langSelect.value = state.language;

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
    saveState();
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

  let _lastActivity = 0;

  function saveState() {
    try {
      if (authCurrentUser && authUsers[authCurrentUser]) {
        authUsers[authCurrentUser].state = state;
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify({ users: authUsers, currentUser: authCurrentUser, lastActivity: _lastActivity || Date.now() }));
    } catch (e) {}
  }

  function loadState() {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.users) {
          authUsers = parsed.users;
          const savedUser = parsed.currentUser || null;
          const lastActivity = parsed.lastActivity || 0;
          if (savedUser && authUsers[savedUser]) {
            const timeout = (authUsers[savedUser].state && authUsers[savedUser].state.sessionTimeout != null)
              ? authUsers[savedUser].state.sessionTimeout : 30;
            if (Date.now() - lastActivity < timeout * 60 * 1000) {
              authCurrentUser = savedUser;
              _lastActivity = lastActivity;
              return authUsers[savedUser].state;
            }
          }
        }
      }
    } catch (e) { console.warn('loadState error:', e); }

    migrateOldUsers();
    authCurrentUser = null;
    _lastActivity = 0;
    return getDefaultState();
  }

  function trackActivity() {
    _lastActivity = Date.now();
    try {
      const data = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
      data.lastActivity = _lastActivity;
      if (authCurrentUser) data.currentUser = authCurrentUser;
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function handleLogout() {
    if (isActive && currentIndex > 0 && !isComplete) {
      if (!confirm('Выйти? Текущий текст будет потерян.')) return;
    }
    authCurrentUser = null;
    _lastActivity = 0;
    state = getDefaultState();
    try {
      const data = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
      data.currentUser = null;
      data.lastActivity = 0;
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    } catch (e) {}
    switchUserBtn.textContent = 'Вход';
    renderKeyboard();
    renderLetters();
    renderText();
    updateStats();
    updateCourseDisplay();
    showAuthOverlay();
  }
  window.handleLogout = handleLogout;

  function migrateOldUsers() {
    if (Object.keys(authUsers).length > 0) return;
    try {
      const old = localStorage.getItem('typingTrainerState');
      if (old) {
        const st = JSON.parse(old);
        if (st && st.ru) {
          const phrase = "Klaviatura123!";
          authUsers['По умолчанию'] = { phrase: phrase, state: st, _first: true };
          localStorage.removeItem('typingTrainerState');
          saveState();
        }
      }
    } catch (e) {}
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

  function setAuthMsg(text, ok) {
    if (text) {
      authMsg.style.display = 'block';
      authMsg.textContent = text;
      authMsg.style.color = ok ? 'var(--correct)' : 'var(--incorrect)';
      authMsg.style.background = ok ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)';
      authMsg.style.borderColor = ok ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)';
    } else {
      authMsg.style.display = 'none';
    }
  }

  function showAuthOverlay() {
    authNameInput.value = '';
    authPhraseInput.value = '';
    authPhraseCounter.textContent = '0 / 50';
    setAuthMsg(null);
    authOverlay.classList.remove('hidden');
    authNameInput.focus();
    if (authCurrentUser && authUsers[authCurrentUser]) {
      authUserInfo.classList.remove('hidden');
      authCurrentUserName.textContent = '👤 ' + authCurrentUser;
    } else {
      authUserInfo.classList.add('hidden');
    }
  }
  window.showAuthOverlay = showAuthOverlay;

  function hideAuthOverlay() { authOverlay.classList.add('hidden'); }
  window.hideAuthOverlay = hideAuthOverlay;

  function handleLogin() {
    const name = authNameInput.value.trim();
    const phrase = authPhraseInput.value;
    if (!name) { setAuthMsg('Введите имя пользователя'); authNameInput.focus(); return; }
    if (!authUsers[name]) { setAuthMsg('Пользователь «' + name + '» не найден'); return; }
    if (authUsers[name]._first) {
      loginAsUser(name);
      return;
    }
    if (phrase !== authUsers[name].phrase) {
      setAuthMsg('Неверная ключевая фраза');
      return;
    }
    loginAsUser(name);
  }
  window.handleLogin = handleLogin;

  function handleRegister() {
    const name = authNameInput.value.trim();
    const phrase = authPhraseInput.value;
    if (!name) { setAuthMsg('Введите имя пользователя'); authNameInput.focus(); return; }
    if (authUsers[name]) { setAuthMsg('Пользователь «' + name + '» уже существует'); return; }
    if (phrase.length < 10 || phrase.length > 50) {
      setAuthMsg('Фраза должна быть от 10 до 50 символов');
      authPhraseInput.focus();
      return;
    }
    authUsers[name] = { phrase: phrase, state: getDefaultState() };
    loginAsUser(name);
  }
  window.handleRegister = handleRegister;

  function loginAsUser(username) {
    authCurrentUser = username;
    if (!authUsers[username]) return;
    const rawState = authUsers[username].state;
    const rawLang = rawState ? rawState.language || 'en' : 'en';
    const oldVersion = rawState && rawState[rawLang] ? rawState[rawLang].courseDataVersion : undefined;
    state = ensureStateStructure(rawState);
    authUsers[username].state = state;
    // Migration: reset course progress if courseDataVersion < 4 (stale data)
    const perLang = state[rawLang];
    if ((!oldVersion || oldVersion < 4) && perLang && perLang.courseBlock > 0) {
      perLang.courseBlock = 0;
      perLang.courseUnit = 0;
      perLang.courseTheoryRead = false;
      perLang.courseBlockExIdx = 0;
      perLang.courseBlockExOrder = [];
      perLang.courseBlockPool = [];
      perLang.courseDataVersion = 4;
    }
    // Auto-set courseLevelCompleted for existing users
    if (perLang && perLang.courseLevelCompleted === -1 && perLang.courseLevel > 0) {
      perLang.courseLevelCompleted = perLang.courseLevel - 1;
    }
    delete authUsers[username]._first;
    saveState();
    hideAuthOverlay();
    switchUserBtn.textContent = '👤 ' + username;
    checkDailyReset();
    totalCount.textContent = langData().letterOrder.length;
    renderKeyboard();
    renderLetters();
    renderText();
    updateStats();
    updateCourseDisplay();
  }

  function switchUser() {
    if (authCurrentUser && authUsers[authCurrentUser]) {
      saveState();
    }
    if (isActive && currentIndex > 0 && !isComplete) {
      if (!confirm('Сменить пользователя? Текущий текст будет потерян.')) return;
    }
    showAuthOverlay();
  }
  window.switchUser = switchUser;

  function handleKeyDown(e) {
    if (e.repeat) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!authCurrentUser) { showAuthOverlay(); return; }
    trackActivity();
    if (isCourseMode()) return;
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
    if (isCourseMode()) return;
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

    saveState();
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
    statsOverlay.classList.remove('hidden');
  }

  function closeStats() {
    statsOverlay.classList.add('hidden');
  }

  function resetAndGenerate() {
    hideModal();
    renderText();
  }

  function resetProgress() {
    if (!confirm('Сбросить весь прогресс по языку ' + langData().name + '?')) return;
    state[state.language] = getDefaultPerLang(state.language);
    saveState();
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
    saveState();
    renderKeyboard();
    renderLetters();
    renderText();
    updateStats();
    updateCourseDisplay();
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
    sessionTimeoutInput.value = state.sessionTimeout || 30;
    courseIgnoreCaseChk.checked = state.courseIgnoreCase !== false;
    courseIgnorePunctChk.checked = state.courseIgnorePunct !== false;
    showKeyboardChk.checked = state.showKeyboard !== false;
    settingsOverlay.classList.remove('hidden');
  }

  function saveSettings() {
    state.dailyGoal = Math.max(1, parseInt(dailyGoalInput.value) || 20);
    state.speedReq = Math.max(10, parseInt(speedInput.value) || 200);
    state.accuracyReq = Math.min(100, Math.max(50, parseInt(accuracyInput.value) || 95)) / 100;
    state.consecutiveReq = Math.max(1, parseInt(streakInput.value) || 5);
    state.textLength = Math.max(10, Math.min(500, parseInt(textLengthInput.value) || 50));
    state.uiScale = Math.max(50, Math.min(150, parseInt(scaleInput.value) || 100));
    state.sessionTimeout = Math.max(1, parseInt(sessionTimeoutInput.value) || 30);
    state.courseIgnoreCase = courseIgnoreCaseChk.checked;
    state.courseIgnorePunct = courseIgnorePunctChk.checked;
    state.showKeyboard = showKeyboardChk.checked;
    applyScale(state.uiScale);
    saveState();
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
          saveState();
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
    initExercises();
    var ver = document.getElementById('appVersion');
    if (ver) ver.textContent = APP_VERSION;
    try {
      state = loadState();
    } catch(e) {
      console.error('loadState failed:', e);
      state = getDefaultState();
    }
    if (!state) { console.error('state is falsy, using default'); state = getDefaultState(); }
    // Migration: reset course progress after COURSE_DATA changes
    (function migrateCourseData(s) {
      for (const lang of Object.keys(s)) {
        if (lang === 'language' || lang === 'dailyGoal' || lang === 'consecutiveReq' ||
            lang === 'speedReq' || lang === 'accuracyReq' || lang === 'courseIgnoreCase' ||
            lang === 'courseIgnorePunct' || typeof s[lang] !== 'object' || !s[lang]) continue;
        const pl = s[lang];
        if (pl.courseBlockPool && pl.courseBlockPool.length) {
          const first = pl.courseBlockPool[0];
          if (first && typeof first.prompt === 'string' && first.prompt.indexOf('/') !== -1) {
            pl.courseBlockPool = [];
            pl.courseBlockExOrder = [];
            pl.courseBlockExIdx = 0;
            pl.courseBlock = 0;
            pl.courseUnit = 0;
            pl.courseTheoryRead = false;
            pl.courseDataVersion = 4;
          }
        }
        if (!pl.courseDataVersion || pl.courseDataVersion < 4) {
          pl.courseDataVersion = 4;
          pl.courseBlock = 0;
          pl.courseUnit = 0;
          pl.courseTheoryRead = false;
          pl.courseBlockExIdx = 0;
          pl.courseBlockExOrder = [];
          pl.courseBlockPool = [];
        }
      }
    })(state);
    checkDailyReset();
    totalCount.textContent = langData().letterOrder.length;
    renderKeyboard();
    renderLetters();
    renderText();
    updateStats();
    document.addEventListener('keydown', handleKeyDown);
    populateLangSelect(false);
    langSelect.value = state.language;
    langSelect.addEventListener('change', switchLanguage);
    updateCourseDisplay();
    newTextBtn.addEventListener('click', function () {
      if (isCourseMode()) {
        // В режиме курса — перейти к следующему упражнению
        if (courseNext.style.display !== 'none') {
          courseNext.click();
        } else {
          const c = cur();
          c.courseBlockExIdx++;
          saveState();
          renderCourseContent();
        }
        return;
      }
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
    modeToggleBtn.addEventListener('click', function () {
      if (isActive && currentIndex > 0 && !isComplete) {
        if (!confirm('Переключить режим? Текущий текст будет потерян.')) return;
      }
      toggleCourseMode();
    });
    switchUserBtn.addEventListener('click', switchUser);
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) hideModal();
    });
    settingsOverlay.addEventListener('click', function (e) {
      if (e.target === settingsOverlay) closeSettings();
    });
    statsOverlay.addEventListener('click', function (e) {
      if (e.target === statsOverlay) closeStats();
    });
    authOverlay.addEventListener('click', function (e) {
      if (e.target === authOverlay) hideAuthOverlay();
    });
    switchUserBtn.addEventListener('click', switchUser);
    authLoginBtn.addEventListener('click', handleLogin);
    authRegisterBtn.addEventListener('click', handleRegister);
    authLogoutBtn.addEventListener('click', handleLogout);
    authPhraseInput.addEventListener('input', function () {
      const len = authPhraseInput.value.length;
      authPhraseCounter.textContent = len + ' / 50';
      authPhraseCounter.style.color = (len >= 10 && len <= 50 || len === 0) ? 'var(--correct)' : 'var(--incorrect)';
    });
    authNameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') authPhraseInput.focus(); });
    scaleInput.addEventListener('input', function () {
      scaleLabel.textContent = scaleInput.value + '%';
    });
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
    applyScale(state.uiScale || 100);
    if (authCurrentUser && authUsers[authCurrentUser]) {
      switchUserBtn.textContent = '👤 ' + authCurrentUser;
      trackActivity();
    }
  }

  function toggleCourseMode() {
    console.log('toggleCourseMode: language=' + state.language + ' curActive=' + cur().courseActive + ' hasCourseData=' + !!COURSE_DATA[state.language]);
    const c = cur();
    c.courseActive = !c.courseActive;
    if (!c.courseActive) {
      console.log('toggling OFF');
      updateCourseKeyboard();
      saveState();
      updateCourseDisplay();
      renderText();
      renderLetters();
      updateStats();
      return;
    }
    if (!COURSE_DATA[state.language]) {
      console.log('switching language to en');
      state.language = 'en';
      langSelect.value = 'en';
      saveState();
    }
    const nc = cur();
    if (!nc.courseLevel && nc.courseLevel !== 0) { nc.courseLevel = 0; nc.courseUnit = 0; }
    console.log('nc courseLevel:', nc.courseLevel, 'nc courseActive:', nc.courseActive);
    // Reset to first level if out of bounds (handles old saved state with different level count)
    if (nc.courseLevel >= COURSE_DATA[state.language].levels.length) {
      nc.courseLevel = 0;
      nc.courseUnit = 0;
    }
    // Всегда начинаем с «Сборка» (block 1), пропуская перевод
    nc.courseBlock = 1;
    nc.courseBlockExIdx = 0;
    nc.courseBlockExOrder = [];
    nc.courseBlockPool = [];
    nc.courseTheoryRead = false;
    courseBlockPool = [];
    nc.courseActive = true;
    saveState();
    updateCourseDisplay();
    renderText();
    renderLetters();
    updateStats();
  }
  window.toggleCourseMode = toggleCourseMode;

  function updateCourseDisplay() {
    if (cur().courseActive && COURSE_DATA[state.language]) {
      const level = COURSE_DATA[state.language].levels[cur().courseLevel];
      modeToggleBtn.textContent = 'Тренажёр';
      mainTitle.textContent = 'Изучение языка';
      newTextBtn.textContent = 'Далее';
      populateLangSelect(true);
      if (!COURSE_DATA[langSelect.value]) {
        langSelect.value = 'en';
        state.language = 'en';
        saveState();
      }
      if (level) {
        const unit = getCurrentUnit();
        const block = getCurrentBlock();
        let info = '<strong>' + level.id + '</strong> ' + level.name;
        if (unit) {
          const gridCell = getGridCell(unit.cellId);
          if (gridCell) info += ' · ' + gridCell.tense + ' · ' + gridCell.type;
          if (block) info += ' → ' + block.label;
        }
        courseLevelDisplay.style.display = '';
        courseLevelDisplay.innerHTML = '📚 ' + info;
      } else {
        courseLevelDisplay.style.display = 'none';
      }
    } else {
      modeToggleBtn.textContent = 'Курс';
      mainTitle.textContent = 'Клавиатурный тренажёр';
      newTextBtn.textContent = 'Новый текст';
      populateLangSelect(false);
      courseLevelDisplay.style.display = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
