// ============================================================
// Библиотека характеристик для генератора NPC
// ============================================================
//
// Категории — верхний уровень тумблеров.
// Слоты — конкретные характеристики внутри категорий.
//
// Слот может содержать:
//   values: [ ... ]         — плоский список значений
//   groups: [ ... ]         — дерево групп (рекурсивно)
//
// Группа:
//   id, label { ru, en }
//   values: [ ... ]  и/или  groups: [ ... ]
//   gender: 'male' | 'female'   — опционально, для фильтрации имён
//
// Значение:
//   { ru, en, tags: [...] }
//   tags: 'medieval', 'modern', 'cyberpunk', 'space'
//   Значения без тегов = универсальные.

export const NPC_CATEGORIES = {
    core: {
        label: { ru: 'Ядро', en: 'Core' },
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
        id: 'gender',
        category: 'core',
        label: { ru: 'Пол', en: 'Gender' },
        values: [
            { ru: 'мужской', en: 'male' },
            { ru: 'женский', en: 'female' }
        ]
    },
    {
        id: 'name_given',
        category: 'core',
        label: { ru: 'Имя', en: 'Given name' },
        groups: [
            {
                id: 'ru',
                label: { ru: 'Русские', en: 'Russian' },
                groups: [
                    {
                        id: 'male',
                        label: { ru: 'Мужские', en: 'Male' },
                        gender: 'male',
                        values: [
                            { ru: 'Иван', en: 'Ivan' },
                            { ru: 'Дмитрий', en: 'Dmitri' },
                            { ru: 'Сергей', en: 'Sergei' },
                            { ru: 'Александр', en: 'Alexander' },
                            { ru: 'Николай', en: 'Nikolai' },
                            { ru: 'Михаил', en: 'Mikhail' },
                            { ru: 'Алексей', en: 'Alexei' },
                            { ru: 'Владимир', en: 'Vladimir' },
                            { ru: 'Андрей', en: 'Andrei' },
                            { ru: 'Егор', en: 'Egor' },
                            { ru: 'Артём', en: 'Artyom' },
                            { ru: 'Павел', en: 'Pavel' },
                            { ru: 'Роман', en: 'Roman' },
                            { ru: 'Кирилл', en: 'Kirill' },
                            { ru: 'Даниил', en: 'Daniil' },
                            { ru: 'Максим', en: 'Maxim' },
                            { ru: 'Григорий', en: 'Grigori' },
                            { ru: 'Ярослав', en: 'Yaroslav' },
                            { ru: 'Борис', en: 'Boris' },
                            { ru: 'Влад', en: 'Vlad' },
                            { ru: 'Фёдор', en: 'Fyodor' },
                            { ru: 'Игнат', en: 'Ignat' },
                            { ru: 'Матвей', en: 'Matvei' },
                            { ru: 'Тимофей', en: 'Timofei' }
                        ]
                    },
                    {
                        id: 'female',
                        label: { ru: 'Женские', en: 'Female' },
                        gender: 'female',
                        values: [
                            { ru: 'Анна', en: 'Anna' },
                            { ru: 'Мария', en: 'Maria' },
                            { ru: 'Екатерина', en: 'Ekaterina' },
                            { ru: 'Ольга', en: 'Olga' },
                            { ru: 'Татьяна', en: 'Tatiana' },
                            { ru: 'Наталья', en: 'Natalia' },
                            { ru: 'Ирина', en: 'Irina' },
                            { ru: 'Светлана', en: 'Svetlana' },
                            { ru: 'Юлия', en: 'Yulia' },
                            { ru: 'Дарья', en: 'Daria' },
                            { ru: 'Анастасия', en: 'Anastasia' },
                            { ru: 'Елена', en: 'Elena' },
                            { ru: 'Ксения', en: 'Ksenia' },
                            { ru: 'Полина', en: 'Polina' },
                            { ru: 'Вера', en: 'Vera' },
                            { ru: 'Надежда', en: 'Nadezhda' },
                            { ru: 'Любовь', en: 'Lyubov' },
                            { ru: 'Софья', en: 'Sofia' },
                            { ru: 'Алиса', en: 'Alisa' },
                            { ru: 'Варвара', en: 'Varvara' },
                            { ru: 'Марина', en: 'Marina' },
                            { ru: 'Галина', en: 'Galina' },
                            { ru: 'Лариса', en: 'Larisa' },
                            { ru: 'Нина', en: 'Nina' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'name_family',
        category: 'core',
        label: { ru: 'Фамилия / прозвание', en: 'Family name / byname' },
        values: [
            { ru: 'Верн', en: 'Vern' },
            { ru: 'Холт', en: 'Holt' },
            { ru: 'Скай', en: 'Skye' },
            { ru: 'Роу', en: 'Rowe' },
            { ru: 'без роду', en: 'of no kin' },
            { ru: 'Одинокий', en: 'the Lone' },
            { ru: 'Дрейк', en: 'Drake' },
            { ru: 'из Бренна', en: 'of Brenn', tags: ['medieval'] },
            { ru: 'Тёмный', en: 'the Dark', tags: ['medieval'] },
            { ru: 'Купец', en: 'the Merchant', tags: ['medieval'] }
        ]
    },
    {
        id: 'age_descriptor',
        category: 'core',
        label: { ru: 'Возраст', en: 'Age' },
        values: [
            { ru: 'совсем юный, едва за двадцать', en: 'very young, barely over twenty' },
            { ru: 'в расцвете сил, около тридцати', en: 'in their prime, about thirty' },
            { ru: 'зрелый, ближе к сорока', en: 'mature, close to forty' },
            { ru: 'в годах, но крепкий', en: 'getting on in years, but sturdy' },
            { ru: 'пожилой, с тяжёлой поступью', en: 'elderly, with a heavy step' },
            { ru: 'на вид не больше двадцати, но глаза старые', en: 'looks no older than twenty, but the eyes are old' },
            { ru: 'средних лет, точный возраст не угадать', en: 'middle-aged, exact age hard to guess' }
        ]
    },
    {
        id: 'role',
        category: 'core',
        label: { ru: 'Роль в сцене', en: 'Role in scene' },
        values: [
            { ru: 'торговец', en: 'merchant' },
            { ru: 'стражник', en: 'guard' },
            { ru: 'трактирщик', en: 'tavern keeper' },
            { ru: 'травница', en: 'herbalist' },
            { ru: 'наёмник', en: 'mercenary' },
            { ru: 'жрица / служитель', en: 'priest / cleric' },
            { ru: 'вор', en: 'thief' },
            { ru: 'лекарь', en: 'healer' },
            { ru: 'наёмный убийца', en: 'assassin' },
            { ru: 'проводник', en: 'guide' },
            { ru: 'нищий', en: 'beggar' },
            { ru: 'кузнец', en: 'blacksmith', tags: ['medieval'] },
            { ru: 'писарь', en: 'scribe', tags: ['medieval'] },
            { ru: 'инженер', en: 'engineer', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'учёный', en: 'scientist', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'корпоративный агент', en: 'corporate agent', tags: ['cyberpunk'] }
        ]
    },

    // ============ APPEARANCE ============
    {
        id: 'body_build',
        category: 'appearance',
        label: { ru: 'Телосложение', en: 'Build' },
        values: [
            { ru: 'худощавый, жилистый', en: 'lean and wiry' },
            { ru: 'плотный, широкоплечий', en: 'stocky and broad-shouldered' },
            { ru: 'высокий и тощий, как жердь', en: 'tall and thin as a pole' },
            { ru: 'низкий, коренастый', en: 'short and stocky' },
            { ru: 'грузный, тяжело ступает', en: 'heavy, walks with weight' },
            { ru: 'сутулый, будто под грузом', en: 'hunched, as if under a burden' },
            { ru: 'стройный, лёгкий в движениях', en: 'slender, light in movement' },
            { ru: 'атлетичный, тренированный', en: 'athletic, trained' }
        ]
    },
    {
        id: 'face_feature',
        category: 'appearance',
        label: { ru: 'Черты лица', en: 'Facial feature' },
        values: [
            { ru: 'острые скулы', en: 'sharp cheekbones' },
            { ru: 'круглое, мягкое лицо', en: 'round, soft face' },
            { ru: 'шрам через бровь', en: 'a scar through the eyebrow' },
            { ru: 'веснушки по всему лицу', en: 'freckles across the face' },
            { ru: 'глубокие морщины у рта', en: 'deep wrinkles around the mouth' },
            { ru: 'сломанный нос, плохо сросся', en: 'a broken nose, poorly set' },
            { ru: 'отсутствует один зуб', en: 'missing a tooth' },
            { ru: 'татуировка на щеке', en: 'a tattoo on the cheek' },
            { ru: 'пепельно-серый оттенок кожи', en: 'ashen-grey skin tone' },
            { ru: 'вытянутое, лошадиное лицо', en: 'a long, horselike face' }
        ]
    },
    {
        id: 'hair',
        category: 'appearance',
        label: { ru: 'Волосы', en: 'Hair' },
        values: [
            { ru: 'коротко стриженые, тёмные', en: 'short-cropped, dark' },
            { ru: 'длинные, собраны в косу', en: 'long, braided' },
            { ru: 'взлохмаченные, вечно спутанные', en: 'messy, forever tangled' },
            { ru: 'седые, с проседью у висков', en: 'grey, salt-and-pepper at the temples' },
            { ru: 'рыжие, огненные', en: 'red, fiery' },
            { ru: 'лысина, прикрыта остатками волос', en: 'balding, combed over' },
            { ru: 'заплетены в мелкие косички', en: 'braided in many small plaits' },
            { ru: 'выбритый висок', en: 'shaved temple', tags: ['modern', 'cyberpunk'] }
        ]
    },
    {
        id: 'eyes',
        category: 'appearance',
        label: { ru: 'Глаза', en: 'Eyes' },
        values: [
            { ru: 'серые, спокойные', en: 'grey, calm' },
            { ru: 'тёмные, как угли', en: 'dark as coals' },
            { ru: 'зелёные, с рыжиной', en: 'green with amber flecks' },
            { ru: 'голубые, светлые', en: 'pale blue' },
            { ru: 'карие, глубоко посаженные', en: 'brown, deep-set' },
            { ru: 'один глаз затянут бельмом', en: 'one eye clouded with a cataract' },
            { ru: 'смотрят в сторону, не встречаются с твоими', en: 'look away, never meeting yours' },
            { ru: 'разного цвета — гетерохромия', en: 'heterochromatic' }
        ]
    },
    {
        id: 'clothing',
        category: 'appearance',
        label: { ru: 'Одежда и стиль', en: 'Clothing & style' },
        values: [
            { ru: 'простая рубаха, заляпанная чем-то', en: 'a plain shirt, stained with something' },
            { ru: 'дорогая ткань, но уже выцветшая', en: 'fine cloth, but faded' },
            { ru: 'многослойные тёмные одежды', en: 'layered dark garments' },
            { ru: 'что-то, что сидит не по размеру', en: 'something that does not fit right' },
            { ru: 'потрёпанный дорожный плащ', en: 'a worn travelling cloak', tags: ['medieval'] },
            { ru: 'кожаный доспех, исцарапанный', en: 'leather armour, scratched', tags: ['medieval'] },
            { ru: 'рабочий комбинезон', en: 'a work coverall', tags: ['modern', 'cyberpunk', 'space'] },
            { ru: 'форменный мундир', en: 'a uniform', tags: ['modern', 'space'] }
        ]
    },
    {
        id: 'distinguishing_mark',
        category: 'appearance',
        label: { ru: 'Особая примета', en: 'Distinguishing mark' },
        values: [
            { ru: 'шрам на тыльной стороне ладони', en: 'a scar on the back of the hand' },
            { ru: 'не снимает перчатку с одной руки', en: 'never removes the glove from one hand' },
            { ru: 'амулет на шнурке под одеждой', en: 'an amulet on a cord beneath the clothes' },
            { ru: 'глубокий ожог на шее', en: 'a deep burn on the neck' },
            { ru: 'пахнет травами и дымом', en: 'smells of herbs and smoke' },
            { ru: 'говорит приглушённо, будто бережёт голос', en: 'speaks in a hush, as if sparing the voice' },
            { ru: 'держит руку в кармане, будто что-то прячет', en: 'keeps a hand in the pocket, as if hiding something' },
            { ru: 'на левом запястье — узкий браслет-оберег', en: 'a narrow charm-bracelet on the left wrist' }
        ]
    },

    // ============ VOICE ============
    {
        id: 'voice_timbre',
        category: 'voice',
        label: { ru: 'Тембр голоса', en: 'Voice timbre' },
        values: [
            { ru: 'низкий, с хрипотцой', en: 'low, slightly hoarse' },
            { ru: 'высокий, звонкий', en: 'high and clear' },
            { ru: 'мягкий, вкрадчивый', en: 'soft and insinuating' },
            { ru: 'сухой, будто пересохло в горле', en: 'dry, as if the throat is parched' },
            { ru: 'глухой, придушенный', en: 'muffled, choked' },
            { ru: 'сиплый, с одышкой', en: 'wheezy, short of breath' },
            { ru: 'ровный, невыразительный', en: 'flat and expressionless' }
        ]
    },
    {
        id: 'voice_manner',
        category: 'voice',
        label: { ru: 'Манера речи', en: 'Speech manner' },
        values: [
            { ru: 'говорит короткими рублеными фразами', en: 'speaks in short clipped phrases' },
            { ru: 'тянет слова, будто нехотя', en: 'drawls as if unwilling' },
            { ru: 'часто переспрашивает, даже когда понял', en: 'keeps asking again even when understood' },
            { ru: 'вставляет присказки и поговорки', en: 'peppers speech with sayings' },
            { ru: 'говорит шёпотом, приходится наклоняться', en: 'whispers, forcing you to lean in' },
            { ru: 'начинает фразу и обрывает на полуслове', en: 'starts a sentence and cuts it off halfway' },
            { ru: 'изъясняется витиевато, любит метафоры', en: 'speaks in elaborate metaphors' },
            { ru: 'проглатывает окончания', en: 'swallows the ends of words' }
        ]
    },

    // ============ MANNER ============
    {
        id: 'posture',
        category: 'manner',
        label: { ru: 'Поза и движение', en: 'Posture & movement' },
        values: [
            { ru: 'стоит расставив ноги, твёрдо', en: 'stands with feet planted, solid' },
            { ru: 'держится вполоборота, готов сорваться', en: 'stands half-turned, ready to bolt' },
            { ru: 'сутулится, будто хочет стать меньше', en: 'hunches, as if trying to seem smaller' },
            { ru: 'двигается плавно, почти беззвучно', en: 'moves smoothly, almost soundlessly' },
            { ru: 'ходит тяжело, чеканя шаг', en: 'walks heavily, marking each step' },
            { ru: 'постоянно оглядывается', en: 'keeps glancing over the shoulder' },
            { ru: 'опирается на что-нибудь, будто устал', en: 'leans on something, as if tired' }
        ]
    },
    {
        id: 'gesture',
        category: 'manner',
        label: { ru: 'Привычные жесты', en: 'Habitual gestures' },
        values: [
            { ru: 'теребит манжету рукава', en: 'fiddles with a cuff' },
            { ru: 'постукивает пальцами по столу', en: 'taps fingers on the table' },
            { ru: 'постоянно поправляет одежду', en: 'constantly adjusts clothing' },
            { ru: 'жестикулирует скупо, почти не двигает руками', en: 'gestures sparingly, hands almost still' },
            { ru: 'при разговоре часто касается лица', en: 'often touches the face while talking' },
            { ru: 'вертит в пальцах какую-то мелочь', en: 'rolls a small object between fingers' },
            { ru: 'складывает руки на груди, закрываясь', en: 'crosses arms, closing off' }
        ]
    },
    {
        id: 'gaze',
        category: 'manner',
        label: { ru: 'Взгляд', en: 'Gaze' },
        values: [
            { ru: 'смотрит прямо, не отводя глаз', en: 'holds your gaze without flinching' },
            { ru: 'отводит взгляд при разговоре', en: 'looks away when speaking' },
            { ru: 'изучает, будто оценивает', en: 'studies you, as if measuring' },
            { ru: 'смотрит поверх головы', en: 'looks over your head' },
            { ru: 'щурится, будто что-то прикидывает', en: 'squints, as if calculating' },
            { ru: 'улыбается одними глазами', en: 'smiles only with the eyes' }
        ]
    },

    // ============ PSYCHOLOGY ============
    {
        id: 'temperament',
        category: 'psychology',
        label: { ru: 'Темперамент', en: 'Temperament' },
        values: [
            { ru: 'спокойный, невозмутимый', en: 'calm and unshakeable' },
            { ru: 'вспыльчивый, за словом в карман не лезет', en: 'hot-tempered, never at a loss for words' },
            { ru: 'меланхоличный, будто всё ему безразлично', en: 'melancholic, as if nothing matters' },
            { ru: 'живой, любопытный, вертлявый', en: 'lively, curious, fidgety' },
            { ru: 'замкнутый, отвечает односложно', en: 'withdrawn, answers in single words' },
            { ru: 'тревожный, всё время ждёт подвоха', en: 'anxious, always expecting trouble' },
            { ru: 'весёлый, но улыбка не доходит до глаз', en: 'cheerful, but the smile does not reach the eyes' }
        ]
    },
    {
        id: 'motivation',
        category: 'psychology',
        label: { ru: 'Что им движет', en: 'Motivation' },
        values: [
            { ru: 'просто хочет пережить ещё один день', en: 'just wants to see another day' },
            { ru: 'ищет того, кто пропал', en: 'is searching for someone who vanished' },
            { ru: 'отрабатывает долг', en: 'is paying off a debt' },
            { ru: 'любопытство сильнее страха', en: 'curiosity outweighs fear' },
            { ru: 'хочет доказать кому-то, что не зря живёт', en: 'wants to prove they are worth something' },
            { ru: 'ищет мести', en: 'is looking for revenge' },
            { ru: 'просто идёт туда, куда ведут ноги', en: 'just goes wherever the road leads' },
            { ru: 'хочет нажиться на чужой беде', en: 'wants to profit from someone else’s trouble' }
        ]
    },
    {
        id: 'quirk',
        category: 'psychology',
        label: { ru: 'Причуда', en: 'Quirk' },
        values: [
            { ru: 'постоянно называет всех полным именем', en: 'always uses full names' },
            { ru: 'коллекционирует мелкие безделушки', en: 'collects small trinkets' },
            { ru: 'не пьёт из чужих кружек', en: 'never drinks from another’s cup' },
            { ru: 'напевает под нос одну и ту же мелодию', en: 'hums the same tune under their breath' },
            { ru: 'всегда садится спиной к стене', en: 'always sits with their back to the wall' },
            { ru: 'не выносит прикосновений', en: 'cannot stand being touched' },
            { ru: 'запоминает мельчайшие детали, но забывает имена', en: 'remembers tiny details but forgets names' },
            { ru: 'разговаривает сам с собой, когда думает', en: 'talks to themselves when thinking' }
        ]
    },

    // ============ PAST (по умолчанию выключено) ============
    {
        id: 'origin',
        category: 'past',
        label: { ru: 'Откуда родом', en: 'Origin' },
        values: [
            { ru: 'из портового города, вырос на причале', en: 'from a port city, raised on the docks' },
            { ru: 'из семьи кочевников', en: 'from a family of nomads' },
            { ru: 'из столицы, но говорит об этом неохотно', en: 'from the capital, but speaks of it reluctantly' },
            { ru: 'нигде не задерживался дольше года', en: 'never stayed anywhere longer than a year' },
            { ru: 'из семьи, которая потеряла всё', en: 'from a family that lost everything' },
            { ru: 'из глухой деревни на краю карты', en: 'from a village on the edge of the map', tags: ['medieval'] }
        ]
    },
    {
        id: 'key_event',
        category: 'past',
        label: { ru: 'Ключевой эпизод', en: 'Key episode' },
        values: [
            { ru: 'в детстве видел, как сгорел дом', en: 'as a child, watched a house burn down' },
            { ru: 'однажды предал того, кто доверял', en: 'once betrayed someone who trusted them' },
            { ru: 'выжил там, где не должен был', en: 'survived where they should not have' },
            { ru: 'потерял всю семью за одну ночь', en: 'lost their entire family in one night' },
            { ru: 'убил человека и до сих пор это носит в себе', en: 'killed a person and still carries it' },
            { ru: 'не помнит, что было до определённого возраста', en: 'cannot recall anything before a certain age' }
        ]
    },

    // ============ SECRET (по умолчанию выключено) ============
    {
        id: 'hidden_goal',
        category: 'secret',
        label: { ru: 'Скрытая цель', en: 'Hidden goal' },
        values: [
            { ru: 'выслеживает кого-то из присутствующих', en: 'is tracking someone present' },
            { ru: 'работает на того, кого здесь нет', en: 'is working for someone not here' },
            { ru: 'хочет исчезнуть и начать заново', en: 'wants to vanish and start over' },
            { ru: 'ищет способ сорвать чей-то план', en: 'is looking to sabotage someone’s plan' },
            { ru: 'защищает того, о ком никто не знает', en: 'is protecting someone no one knows about' }
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
