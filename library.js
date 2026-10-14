// ============================================================
// Библиотека характеристик для генератора NPC
// ============================================================
//
// Структура:
//   NPC_CATEGORIES — верхний уровень тумблеров (группы).
//   NPC_LIBRARY    — плоский список слотов с значениями.
//
// Поля слота:
//   id            — уникальный идентификатор (не менять после релиза!)
//   category      — к какой группе относится
//   label         — { ru, en }
//   multiple      — может ли выпасть несколько значений из слота
//   minCount/maxCount — для multiple: сколько значений тянуть
//   values        — массив значений
//
// Значение:
//   { ru, en, tags: [...] }
//   tags могут содержать: 'universal', 'medieval', 'modern', 'cyberpunk',
//                          'space', 'omegaverse', 'oviposition'
//   Если тег 'universal' — подходит везде. Если теги конкретные — только
//   при совпадении с настройкой сеттинга.

export const NPC_CATEGORIES = {
    core: {
        label: { ru: 'Ядро', en: 'Core' },
        description: {
            ru: 'Базовые данные, отключить нельзя',
            en: 'Basic data, cannot be disabled'
        },
        required: true
    },
    appearance: {
        label: { ru: 'Внешность', en: 'Appearance' },
        defaultEnabled: true
    },
    voice: {
        label: { ru: 'Голос и речь', en: 'Voice & Speech' },
        defaultEnabled: true
    },
    manner: {
        label: { ru: 'Манера держаться', en: 'Mannerisms' },
        defaultEnabled: true
    },
    psychology: {
        label: { ru: 'Психология', en: 'Psychology' },
        defaultEnabled: true
    },
    past: {
        label: { ru: 'Прошлое', en: 'Past' },
        defaultEnabled: false
    },
    secret: {
        label: { ru: 'Скрытое (не рекомендуется)', en: 'Secret (not recommended)' },
        defaultEnabled: false
    }
};

export const NPC_LIBRARY = [
    // ============ CORE ============
    {
        id: 'name_given',
        category: 'core',
        label: { ru: 'Имя', en: 'Given name' },
        values: [
            { ru: 'Марта', en: 'Martha', tags: ['universal'] },
            { ru: 'Йорн', en: 'Jorn', tags: ['universal'] },
            { ru: 'Кассия', en: 'Cassia', tags: ['universal'] },
            { ru: 'Ральф', en: 'Ralph', tags: ['universal'] },
            { ru: 'Нэйра', en: 'Naira', tags: ['universal'] },
            { ru: 'Теодор', en: 'Theodore', tags: ['universal'] },
            { ru: 'Ада', en: 'Ada', tags: ['universal'] },
            { ru: 'Сильван', en: 'Sylvan', tags: ['universal'] },
            { ru: 'Ирис', en: 'Iris', tags: ['universal'] },
            { ru: 'Хаким', en: 'Hakim', tags: ['universal'] },
            { ru: 'Вейл', en: 'Vale', tags: ['universal'] },
            { ru: 'Ора', en: 'Ora', tags: ['universal'] },
            { ru: 'Каин', en: 'Cain', tags: ['universal'] },
            { ru: 'Лис', en: 'Lis', tags: ['universal'] }
        ]
    },
    {
        id: 'name_family',
        category: 'core',
        label: { ru: 'Фамилия / прозвание', en: 'Family name / byname' },
        values: [
            { ru: 'из Бренна', en: 'of Brenn', tags: ['medieval'] },
            { ru: 'Тёмный', en: 'the Dark', tags: ['medieval'] },
            { ru: 'Купец', en: 'the Merchant', tags: ['medieval'] },
            { ru: 'Верн', en: 'Vern', tags: ['universal'] },
            { ru: 'Холт', en: 'Holt', tags: ['universal'] },
            { ru: 'Скай', en: 'Skye', tags: ['universal'] },
            { ru: 'Роу', en: 'Rowe', tags: ['universal'] },
            { ru: 'без роду', en: 'of no kin', tags: ['universal'] },
            { ru: 'Одинокий', en: 'the Lone', tags: ['universal'] },
            { ru: 'Дрейк', en: 'Drake', tags: ['modern', 'universal'] }
        ]
    },
    {
        id: 'age_descriptor',
        category: 'core',
        label: { ru: 'Возраст', en: 'Age' },
        values: [
            { ru: 'совсем юный, едва за двадцать', en: 'very young, barely over twenty', tags: ['universal'] },
            { ru: 'в расцвете сил, около тридцати', en: 'in their prime, about thirty', tags: ['universal'] },
            { ru: 'зрелый, ближе к сорока', en: 'mature, close to forty', tags: ['universal'] },
            { ru: 'в годах, но крепкий', en: 'getting on in years, but sturdy', tags: ['universal'] },
            { ru: 'пожилой, с тяжёлой поступью', en: 'elderly, with a heavy step', tags: ['universal'] },
            { ru: 'на вид не больше двадцати, но глаза старые', en: 'looks no older than twenty, but the eyes are old', tags: ['universal'] },
            { ru: 'средних лет, точный возраст не угадать', en: 'middle-aged, exact age hard to guess', tags: ['universal'] }
        ]
    },
    {
        id: 'role',
        category: 'core',
        label: { ru: 'Роль в сцене', en: 'Role in scene' },
        values: [
            { ru: 'торговец', en: 'merchant', tags: ['universal'] },
            { ru: 'стражник', en: 'guard', tags: ['universal'] },
            { ru: 'трактирщик', en: 'tavern keeper', tags: ['universal'] },
            { ru: 'травница', en: 'herbalist', tags: ['universal'] },
            { ru: 'кузнец', en: 'blacksmith', tags: ['medieval', 'universal'] },
            { ru: 'писарь', en: 'scribe', tags: ['medieval', 'universal'] },
            { ru: 'наёмник', en: 'mercenary', tags: ['universal'] },
            { ru: 'жрица / служитель', en: 'priest / cleric', tags: ['universal'] },
            { ru: 'вор', en: 'thief', tags: ['universal'] },
            { ru: 'лекарь', en: 'healer', tags: ['universal'] },
            { ru: 'инженер', en: 'engineer', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'учёный', en: 'scientist', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'наёмный убийца', en: 'assassin', tags: ['universal'] },
            { ru: 'проводник', en: 'guide', tags: ['universal'] },
            { ru: 'нищий', en: 'beggar', tags: ['universal'] }
        ]
    },

    // ============ APPEARANCE ============
    {
        id: 'body_build',
        category: 'appearance',
        label: { ru: 'Телосложение', en: 'Build' },
        values: [
            { ru: 'худощавый, жилистый', en: 'lean and wiry', tags: ['universal'] },
            { ru: 'плотный, широкоплечий', en: 'stocky and broad-shouldered', tags: ['universal'] },
            { ru: 'высокий и тощий, как жердь', en: 'tall and thin as a pole', tags: ['universal'] },
            { ru: 'низкий, коренастый', en: 'short and stocky', tags: ['universal'] },
            { ru: 'грузный, тяжело ступает', en: 'heavy, walks with weight', tags: ['universal'] },
            { ru: 'сутулый, будто под грузом', en: 'hunched, as if under a burden', tags: ['universal'] },
            { ru: 'стройный, лёгкий в движениях', en: 'slender, light in movement', tags: ['universal'] },
            { ru: 'атлетичный, тренированный', en: 'athletic, trained', tags: ['universal'] }
        ]
    },
    {
        id: 'face_feature',
        category: 'appearance',
        label: { ru: 'Черты лица', en: 'Facial feature' },
        values: [
            { ru: 'острые скулы', en: 'sharp cheekbones', tags: ['universal'] },
            { ru: 'круглое, мягкое лицо', en: 'round, soft face', tags: ['universal'] },
            { ru: 'шрам через бровь', en: 'a scar through the eyebrow', tags: ['universal'] },
            { ru: 'веснушки по всему лицу', en: 'freckles across the face', tags: ['universal'] },
            { ru: 'глубокие морщины у рта', en: 'deep wrinkles around the mouth', tags: ['universal'] },
            { ru: 'сломанный нос, плохо сросся', en: 'a broken nose, poorly set', tags: ['universal'] },
            { ru: 'отсутствует один зуб', en: 'missing a tooth', tags: ['universal'] },
            { ru: 'татуировка на щеке', en: 'a tattoo on the cheek', tags: ['universal'] },
            { ru: 'пепельно-серый оттенок кожи', en: 'ashen-grey skin tone', tags: ['universal'] },
            { ru: 'вытянутое, лошадиное лицо', en: 'a long, horselike face', tags: ['universal'] }
        ]
    },
    {
        id: 'hair',
        category: 'appearance',
        label: { ru: 'Волосы', en: 'Hair' },
        values: [
            { ru: 'коротко стриженые, тёмные', en: 'short-cropped, dark', tags: ['universal'] },
            { ru: 'длинные, собраны в косу', en: 'long, braided', tags: ['universal'] },
            { ru: 'взлохмаченные, вечно спутанные', en: 'messy, forever tangled', tags: ['universal'] },
            { ru: 'седые, с проседью у висков', en: 'grey, salt-and-pepper at the temples', tags: ['universal'] },
            { ru: 'рыжие, огненные', en: 'red, fiery', tags: ['universal'] },
            { ru: 'выбритый висок', en: 'shaved temple', tags: ['modern', 'cyberpunk', 'universal'] },
            { ru: 'лысина, прикрыта остатками волос', en: 'balding, combed over', tags: ['universal'] },
            { ru: 'заплетены в мелкие косички', en: 'braided in many small plaits', tags: ['universal'] }
        ]
    },
    {
        id: 'eyes',
        category: 'appearance',
        label: { ru: 'Глаза', en: 'Eyes' },
        values: [
            { ru: 'серые, спокойные', en: 'grey, calm', tags: ['universal'] },
            { ru: 'тёмные, как угли', en: 'dark as coals', tags: ['universal'] },
            { ru: 'зелёные, с рыжиной', en: 'green with amber flecks', tags: ['universal'] },
            { ru: 'голубые, светлые', en: 'pale blue', tags: ['universal'] },
            { ru: 'карие, глубоко посаженные', en: 'brown, deep-set', tags: ['universal'] },
            { ru: 'один глаз затянут бельмом', en: 'one eye clouded with a cataract', tags: ['universal'] },
            { ru: 'смотрят в сторону, не встречаются с твоими', en: 'look away, never meeting yours', tags: ['universal'] },
            { ru: 'разного цвета — гетерохромия', en: 'heterochromatic', tags: ['universal'] }
        ]
    },
    {
        id: 'clothing',
        category: 'appearance',
        label: { ru: 'Одежда и стиль', en: 'Clothing & style' },
        values: [
            { ru: 'потрёпанный дорожный плащ', en: 'a worn travelling cloak', tags: ['medieval', 'universal'] },
            { ru: 'простая рубаха, заляпанная чем-то', en: 'a plain shirt, stained with something', tags: ['universal'] },
            { ru: 'кожаный доспех, исцарапанный', en: 'leather armour, scratched', tags: ['medieval', 'universal'] },
            { ru: 'дорогая ткань, но уже выцветшая', en: 'fine cloth, but faded', tags: ['universal'] },
            { ru: 'многослойные тёмные одежды', en: 'layered dark garments', tags: ['universal'] },
            { ru: 'рабочий комбинезон', en: 'a work coverall', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'форменный мундир', en: 'a uniform', tags: ['modern', 'space', 'universal'] },
            { ru: 'что-то, что сидит не по размеру', en: 'something that does not fit right', tags: ['universal'] }
        ]
    },
    {
        id: 'distinguishing_mark',
        category: 'appearance',
        label: { ru: 'Особая примета', en: 'Distinguishing mark' },
        multiple: true,
        minCount: 1,
        maxCount: 1,
        values: [
            { ru: 'шрам на тыльной стороне ладони', en: 'a scar on the back of the hand', tags: ['universal'] },
            { ru: 'не снимает перчатку с одной руки', en: 'never removes the glove from one hand', tags: ['universal'] },
            { ru: 'амулет на шнурке под одеждой', en: 'an amulet on a cord beneath the clothes', tags: ['universal'] },
            { ru: 'глубокий ожог на шее', en: 'a deep burn on the neck', tags: ['universal'] },
            { ru: 'пахнет травами и дымом', en: 'smells of herbs and smoke', tags: ['universal'] },
            { ru: 'говорит приглушённо, будто бережёт голос', en: 'speaks in a hush, as if sparing the voice', tags: ['universal'] },
            { ru: 'держит руку в кармане, будто что-то прячет', en: 'keeps a hand in the pocket, as if hiding something', tags: ['universal'] },
            { ru: 'на левом запястье — узкий браслет-оберег', en: 'a narrow charm-bracelet on the left wrist', tags: ['universal'] }
        ]
    },

    // ============ VOICE ============
    {
        id: 'voice_timbre',
        category: 'voice',
        label: { ru: 'Тембр голоса', en: 'Voice timbre' },
        values: [
            { ru: 'низкий, с хрипотцой', en: 'low, slightly hoarse', tags: ['universal'] },
            { ru: 'высокий, звонкий', en: 'high and clear', tags: ['universal'] },
            { ru: 'мягкий, вкрадчивый', en: 'soft and insinuating', tags: ['universal'] },
            { ru: 'сухой, будто пересохло в горле', en: 'dry, as if the throat is parched', tags: ['universal'] },
            { ru: 'глухой, придушенный', en: 'muffled, choked', tags: ['universal'] },
            { ru: 'сиплый, с одышкой', en: 'wheezy, short of breath', tags: ['universal'] },
            { ru: 'ровный, невыразительный', en: 'flat and expressionless', tags: ['universal'] }
        ]
    },
    {
        id: 'voice_manner',
        category: 'voice',
        label: { ru: 'Манера речи', en: 'Speech manner' },
        values: [
            { ru: 'говорит короткими рублеными фразами', en: 'speaks in short clipped phrases', tags: ['universal'] },
            { ru: 'тянет слова, будто нехотя', en: 'drawls as if unwilling', tags: ['universal'] },
            { ru: 'часто переспрашивает, даже когда понял', en: 'keeps asking again even when understood', tags: ['universal'] },
            { ru: 'вставляет присказки и поговорки', en: 'peppers speech with sayings', tags: ['universal'] },
            { ru: 'говорит шёпотом, приходится наклоняться', en: 'whispers, forcing you to lean in', tags: ['universal'] },
            { ru: 'начинает фразу и обрывает на полуслове', en: 'starts a sentence and cuts it off halfway', tags: ['universal'] },
            { ru: 'изъясняется витиевато, любит метафоры', en: 'speaks in elaborate metaphors', tags: ['universal'] },
            { ru: 'проглатывает окончания', en: 'swallows the ends of words', tags: ['universal'] }
        ]
    },

    // ============ MANNER ============
    {
        id: 'posture',
        category: 'manner',
        label: { ru: 'Поза и движение', en: 'Posture & movement' },
        values: [
            { ru: 'стоит расставив ноги, твёрдо', en: 'stands with feet planted, solid', tags: ['universal'] },
            { ru: 'держится вполоборота, готов сорваться', en: 'stands half-turned, ready to bolt', tags: ['universal'] },
            { ru: 'сутулится, будто хочет стать меньше', en: 'hunches, as if trying to seem smaller', tags: ['universal'] },
            { ru: 'двигается плавно, почти беззвучно', en: 'moves smoothly, almost soundlessly', tags: ['universal'] },
            { ru: 'ходит тяжело, чеканя шаг', en: 'walks heavily, marking each step', tags: ['universal'] },
            { ru: 'постоянно оглядывается', en: 'keeps glancing over the shoulder', tags: ['universal'] },
            { ru: 'опирается на что-нибудь, будто устал', en: 'leans on something, as if tired', tags: ['universal'] }
        ]
    },
    {
        id: 'gesture',
        category: 'manner',
        label: { ru: 'Привычные жесты', en: 'Habitual gestures' },
        values: [
            { ru: 'теребит манжету рукава', en: 'fiddles with a cuff', tags: ['universal'] },
            { ru: 'постукивает пальцами по столу', en: 'taps fingers on the table', tags: ['universal'] },
            { ru: 'постоянно поправляет одежду', en: 'constantly adjusts clothing', tags: ['universal'] },
            { ru: 'жестикулирует скупо, почти не двигает руками', en: 'gestures sparingly, hands almost still', tags: ['universal'] },
            { ru: 'при разговоре часто касается лица', en: 'often touches the face while talking', tags: ['universal'] },
            { ru: 'вертит в пальцах какую-то мелочь', en: 'rolls a small object between fingers', tags: ['universal'] },
            { ru: 'складывает руки на груди, закрываясь', en: 'crosses arms, closing off', tags: ['universal'] }
        ]
    },
    {
        id: 'gaze',
        category: 'manner',
        label: { ru: 'Взгляд', en: 'Gaze' },
        values: [
            { ru: 'смотрит прямо, не отводя глаз', en: 'holds your gaze without flinching', tags: ['universal'] },
            { ru: 'отводит взгляд при разговоре', en: 'looks away when speaking', tags: ['universal'] },
            { ru: 'изучает, будто оценивает', en: 'studies you, as if measuring', tags: ['universal'] },
            { ru: 'смотрит поверх головы', en: 'looks over your head', tags: ['universal'] },
            { ru: 'щурится, будто что-то прикидывает', en: 'squints, as if calculating', tags: ['universal'] },
            { ru: 'улыбается одними глазами', en: 'smiles only with the eyes', tags: ['universal'] }
        ]
    },

    // ============ PSYCHOLOGY ============
    {
        id: 'temperament',
        category: 'psychology',
        label: { ru: 'Темперамент', en: 'Temperament' },
        values: [
            { ru: 'спокойный, невозмутимый', en: 'calm and unshakeable', tags: ['universal'] },
            { ru: 'вспыльчивый, за словом в карман не лезет', en: 'hot-tempered, never at a loss for words', tags: ['universal'] },
            { ru: 'меланхоличный, будто всё ему безразлично', en: 'melancholic, as if nothing matters', tags: ['universal'] },
            { ru: 'живой, любопытный, вертлявый', en: 'lively, curious, fidgety', tags: ['universal'] },
            { ru: 'замкнутый, отвечает односложно', en: 'withdrawn, answers in single words', tags: ['universal'] },
            { ru: 'тревожный, всё время ждёт подвоха', en: 'anxious, always expecting trouble', tags: ['universal'] },
            { ru: 'весёлый, но улыбка не доходит до глаз', en: 'cheerful, but the smile does not reach the eyes', tags: ['universal'] }
        ]
    },
    {
        id: 'motivation',
        category: 'psychology',
        label: { ru: 'Что им движет', en: 'Motivation' },
        values: [
            { ru: 'просто хочет пережить ещё один день', en: 'just wants to see another day', tags: ['universal'] },
            { ru: 'ищет того, кто пропал', en: 'is searching for someone who vanished', tags: ['universal'] },
            { ru: 'отрабатывает долг', en: 'is paying off a debt', tags: ['universal'] },
            { ru: 'любопытство сильнее страха', en: 'curiosity outweighs fear', tags: ['universal'] },
            { ru: 'хочет доказать кому-то, что не зря живёт', en: 'wants to prove they are worth something', tags: ['universal'] },
            { ru: 'ищет мести', en: 'is looking for revenge', tags: ['universal'] },
            { ru: 'просто идёт туда, куда ведут ноги', en: 'just goes wherever the road leads', tags: ['universal'] },
            { ru: 'хочет нажиться на чужой беде', en: 'wants to profit from someone else’s trouble', tags: ['universal'] }
        ]
    },
    {
        id: 'quirk',
        category: 'psychology',
        label: { ru: 'Причуда', en: 'Quirk' },
        values: [
            { ru: 'постоянно называет всех полным именем', en: 'always uses full names', tags: ['universal'] },
            { ru: 'коллекционирует мелкие безделушки', en: 'collects small trinkets', tags: ['universal'] },
            { ru: 'не пьёт из чужих кружек', en: 'never drinks from another’s cup', tags: ['universal'] },
            { ru: 'напевает под нос одну и ту же мелодию', en: 'hums the same tune under their breath', tags: ['universal'] },
            { ru: 'всегда садится спиной к стене', en: 'always sits with their back to the wall', tags: ['universal'] },
            { ru: 'не выносит прикосновений', en: 'cannot stand being touched', tags: ['universal'] },
            { ru: 'запоминает мельчайшие детали, но забывает имена', en: 'remembers tiny details but forgets names', tags: ['universal'] },
            { ru: 'разговаривает сам с собой, когда думает', en: 'talks to themselves when thinking', tags: ['universal'] }
        ]
    },

    // ============ PAST (по умолчанию выключено) ============
    {
        id: 'origin',
        category: 'past',
        label: { ru: 'Откуда родом', en: 'Origin' },
        values: [
            { ru: 'из глухой деревни на краю карты', en: 'from a village on the edge of the map', tags: ['medieval', 'universal'] },
            { ru: 'из портового города, вырос на причале', en: 'from a port city, raised on the docks', tags: ['universal'] },
            { ru: 'из семьи кочевников', en: 'from a family of nomads', tags: ['universal'] },
            { ru: 'из столицы, но говорит об этом неохотно', en: 'from the capital, but speaks of it reluctantly', tags: ['universal'] },
            { ru: 'нигде не задерживался дольше года', en: 'never stayed anywhere longer than a year', tags: ['universal'] },
            { ru: 'из семьи, которая потеряла всё', en: 'from a family that lost everything', tags: ['universal'] }
        ]
    },
    {
        id: 'key_event',
        category: 'past',
        label: { ru: 'Ключевой эпизод', en: 'Key episode' },
        values: [
            { ru: 'в детстве видел, как сгорел дом', en: 'as a child, watched a house burn down', tags: ['universal'] },
            { ru: 'однажды предал того, кто доверял', en: 'once betrayed someone who trusted them', tags: ['universal'] },
            { ru: 'выжил там, где не должен был', en: 'survived where they should not have', tags: ['universal'] },
            { ru: 'потерял всю семью за одну ночь', en: 'lost their entire family in one night', tags: ['universal'] },
            { ru: 'убил человека и до сих пор это носит в себе', en: 'killed a person and still carries it', tags: ['universal'] },
            { ru: 'не помнит, что было до определённого возраста', en: 'cannot recall anything before a certain age', tags: ['universal'] }
        ]
    },

    // ============ SECRET (по умолчанию выключено) ============
    {
        id: 'hidden_goal',
        category: 'secret',
        label: { ru: 'Скрытая цель', en: 'Hidden goal' },
        values: [
            { ru: 'выслеживает кого-то из присутствующих', en: 'is tracking someone present', tags: ['universal'] },
            { ru: 'работает на того, кого здесь нет', en: 'is working for someone not here', tags: ['universal'] },
            { ru: 'хочет исчезнуть и начать заново', en: 'wants to vanish and start over', tags: ['universal'] },
            { ru: 'ищет способ сорвать чей-то план', en: 'is looking to sabotage someone’s plan', tags: ['universal'] },
            { ru: 'защищает того, о ком никто не знает', en: 'is protecting someone no one knows about', tags: ['universal'] }
        ]
    }
];

// Утилита: сгруппировать слоты по категориям
export function getSlotsByCategory() {
    const grouped = {};
    for (const slot of NPC_LIBRARY) {
        if (!grouped[slot.category]) grouped[slot.category] = [];
        grouped[slot.category].push(slot);
    }
    return grouped;
                                                                                     }
