import {
    saveSettingsDebounced,
    setExtensionPrompt,
    extension_prompt_types,
    eventSource,
    event_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { NPC_CATEGORIES, NPC_LIBRARY, getSlotsByCategory } from './library.js';

const EXTENSION_NAME = 'npc-generator';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    setting: 'universal',
    injectToPrompt: false,
    chatNpcData: {},
    // UI-состояние (сохраняется между перезагрузками)
    openCategories: [],
    openSlots: [],
    openNpcs: []
};

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true;
let isReady = false;

const INJECT_LABELS = {
    name_given: 'name',
    name_family: 'surname',
    age_descriptor: 'age',
    role: 'role',
    body_build: 'build',
    face_feature: 'face',
    hair: 'hair',
    eyes: 'eyes',
    clothing: 'clothing',
    distinguishing_mark: 'mark',
    voice_timbre: 'voice',
    voice_manner: 'speech',
    posture: 'posture',
    gesture: 'gesture',
    gaze: 'gaze',
    temperament: 'temperament',
    motivation: 'motivation',
    quirk: 'quirk',
    origin: 'origin',
    key_event: 'past',
    hidden_goal: 'secret'
};

function getInjectLabel(slotId) {
    return INJECT_LABELS[slotId] || slotId;
}

// ------------------------------------------------------------
// Данные чата
// ------------------------------------------------------------

function getCurrentChatId() {
    if (typeof SillyTavern?.getContext === 'function') {
        const ctx = SillyTavern.getContext();
        if (ctx?.chatId) return ctx.chatId;
    }
    if (window.chat_id) return window.chat_id;
    return null;
}

function createDefaultChatData() {
    return {
        npcs: [],
        overrides: {
            disabledCategories: [],
            disabledSlots: [],
            excludedValues: {}   // { slotId: ['english_text', ...] }
        }
    };
}

function getChatData() {
    const chatId = getCurrentChatId();
    if (!chatId) return null;
    if (!settings.chatNpcData[chatId]) {
        settings.chatNpcData[chatId] = createDefaultChatData();
    }
    const data = settings.chatNpcData[chatId];
    if (!data.npcs) data.npcs = [];
    if (!data.overrides) data.overrides = createDefaultChatData().overrides;
    if (!data.overrides.disabledCategories) data.overrides.disabledCategories = [];
    if (!data.overrides.disabledSlots) data.overrides.disabledSlots = [];
    if (!data.overrides.excludedValues) data.overrides.excludedValues = {};
    return data;
}

// ------------------------------------------------------------
// Проверки
// ------------------------------------------------------------

function isSlotEnabled(slot, chatData) {
    const cat = NPC_CATEGORIES[slot.category];
    if (cat?.required) return true;
    if (chatData.overrides.disabledCategories.includes(slot.category)) return false;
    if (chatData.overrides.disabledSlots.includes(slot.id)) return false;
    if (cat?.defaultEnabled === false) return false;
    return true;
}

function isValueExcluded(slotId, value, chatData) {
    const excluded = chatData.overrides.excludedValues[slotId] || [];
    return excluded.includes(value.en);
}

function matchesSetting(value, setting) {
    const tags = value.tags || [];
    if (tags.length === 0) return true;
    if (setting === 'universal') return true;
    return tags.includes(setting);
}

// ------------------------------------------------------------
// Генерация
// ------------------------------------------------------------

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNpcFields(chatData, setting) {
    const fields = {};
    for (const slot of NPC_LIBRARY) {
        if (!isSlotEnabled(slot, chatData)) continue;

        const available = slot.values.filter(v =>
            matchesSetting(v, setting) && !isValueExcluded(slot.id, v, chatData)
        );
        if (!available.length) continue;

        if (slot.multiple) {
            const min = slot.minCount ?? 1;
            const max = slot.maxCount ?? 1;
            const count = min + Math.floor(Math.random() * (max - min + 1));
            const pool = [...available];
            const picked = [];
            for (let i = 0; i < count && pool.length > 0; i++) {
                picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
            }
            fields[slot.id] = picked;
        } else {
            fields[slot.id] = pickRandom(available);
        }
    }
    return fields;
}

function generateNpc(chatData, setting) {
    const npc = {
        id: 'npc_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        fields: generateNpcFields(chatData, setting),
        inPrompt: true,
        createdAt: Date.now()
    };
    chatData.npcs.push(npc);
    return npc;
}

// ------------------------------------------------------------
// Сборка текста
// ------------------------------------------------------------

function valueToText(val, lang) {
    if (Array.isArray(val)) return val.map(v => valueToText(v, lang)).join(', ');
    return val?.[lang] || val?.ru || '';
}

function buildNpcLine(npc) {
    const parts = [];
    for (const slot of NPC_LIBRARY) {
        const val = npc.fields[slot.id];
        if (!val) continue;
        const text = valueToText(val, 'en');
        if (!text) continue;
        parts.push(`${getInjectLabel(slot.id)}: ${text}`);
    }
    return parts.join('; ');
}

function buildNpcLabel(npc) {
    const name = valueToText(npc.fields.name_given, 'ru');
    const role = valueToText(npc.fields.role, 'ru');
    if (name && role) return `${name} — ${role}`;
    return name || role || 'NPC';
}

function buildInjectionText(chatData) {
    const active = chatData.npcs.filter(n => n.inPrompt);
    if (!active.length) return '';
    const lines = active.map(npc => `• ${buildNpcLine(npc)}`);
    return `[NPC in scene]\n${lines.join('\n')}`;
}

function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}

// ------------------------------------------------------------
// Инъекция
// ------------------------------------------------------------

function updatePrompt() {
    if (!settings.isEnabled || !settings.injectToPrompt) {
        setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0);
        return;
    }
    const chatData = getChatData();
    if (!chatData) return;
    const text = buildInjectionText(chatData);
    setExtensionPrompt(EXTENSION_NAME, text, extension_prompt_types.IN_CHAT, 0);
}

function notify(text, type = 'info') {
    if (typeof toastr !== 'undefined') {
        toastr[type]?.(text) || toastr.info(text);
    }
}

// ------------------------------------------------------------
// Утилиты
// ------------------------------------------------------------

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ------------------------------------------------------------
// Рендер дерева библиотеки
// ------------------------------------------------------------

function renderCategoryTree(chatData) {
    const grouped = getSlotsByCategory();
    let html = '';

    for (const [catId, cat] of Object.entries(NPC_CATEGORIES)) {
        const slots = grouped[catId] || [];
        if (!slots.length) continue;

        const catDisabled = chatData.overrides.disabledCategories.includes(catId);
        const catChecked = cat.required ? true : !catDisabled;
        const requiredAttr = cat.required ? 'disabled' : '';
        const catOpen = settings.openCategories.includes(catId) ? ' open' : '';

        html += `
            <div class="npc-gen-category${catOpen}" data-cat="${catId}">
                <div class="npc-gen-cat-header">
                    <input type="checkbox" class="npc-gen-checkbox-sm npc-cat-cb" data-cat="${catId}" ${catChecked ? 'checked' : ''} ${requiredAttr}>
                    <span class="npc-gen-toggle-icon npc-gen-cat-toggle">▸</span>
                    <span class="npc-gen-cat-name">${escapeHtml(cat.label.ru)}</span>
                    ${cat.required ? '<span class="npc-gen-cat-required">(обязательно)</span>' : ''}
                </div>
                <div class="npc-gen-cat-body">
                    ${slots.map(slot => {
                        const slotDisabled = chatData.overrides.disabledSlots.includes(slot.id);
                        const slotChecked = !slotDisabled;
                        const excluded = chatData.overrides.excludedValues[slot.id] || [];
                        const slotOpen = settings.openSlots.includes(slot.id) ? ' open' : '';

                        const valuesHtml = slot.values.map(v => {
                            const isExcluded = excluded.includes(v.en);
                            return `
                                <label class="npc-gen-value-label">
                                    <input type="checkbox" class="npc-gen-checkbox-sm npc-value-cb" data-slot="${slot.id}" data-value="${escapeHtml(v.en)}" ${isExcluded ? '' : 'checked'}>
                                    <span>${escapeHtml(v.ru)}</span>
                                </label>
                            `;
                        }).join('');

                        return `
                            <div class="npc-gen-slot${slotOpen}" data-slot="${slot.id}">
                                <div class="npc-gen-slot-header">
                                    <input type="checkbox" class="npc-gen-checkbox-sm npc-slot-cb" data-slot="${slot.id}" ${slotChecked ? 'checked' : ''}>
                                    <span class="npc-gen-toggle-icon npc-gen-slot-toggle">▸</span>
                                    <span class="npc-gen-slot-name">${escapeHtml(slot.label.ru)}</span>
                                </div>
                                <div class="npc-gen-slot-values">
                                    ${valuesHtml}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    return html;
}

// ------------------------------------------------------------
// Рендер списка NPC
// ------------------------------------------------------------

function renderNpcFields(npc) {
    let html = '';
    for (const slot of NPC_LIBRARY) {
        const val = npc.fields[slot.id];
        if (!val) continue;
        const text = valueToText(val, 'ru');
        if (!text) continue;
        html += `<div class="npc-gen-field"><span class="npc-gen-field-label">${escapeHtml(slot.label.ru)}:</span> ${escapeHtml(text)}</div>`;
    }
    return html || '<div class="npc-gen-field" style="opacity:0.5;">— пусто —</div>';
}

function renderNpcList(chatData) {
    if (!chatData.npcs.length) {
        return `<div class="npc-gen-empty">NPC пока не сгенерированы.</div>`;
    }
    return chatData.npcs.map(npc => {
        const isOpen = settings.openNpcs.includes(npc.id) ? ' open' : '';
        return `
            <div class="npc-gen-item${isOpen}" data-id="${npc.id}">
                <div class="npc-gen-item-header">
                    <input type="checkbox" class="npc-gen-checkbox-sm npc-inprompt-cb" data-id="${npc.id}" ${npc.inPrompt ? 'checked' : ''}>
                    <div class="npc-gen-item-label">${escapeHtml(buildNpcLabel(npc))}</div>
                    <span class="npc-gen-toggle-icon npc-gen-item-toggle">▸</span>
                    <button class="npc-gen-delete-btn npc-delete-btn" data-id="${npc.id}">×</button>
                </div>
                <div class="npc-gen-item-body">
                    ${renderNpcFields(npc)}
                </div>
            </div>
        `;
    }).join('');
}

// ------------------------------------------------------------
// Главный рендер
// ------------------------------------------------------------

function renderUI() {
    if (!isReady) return;
    const chatData = getChatData();
    if (!chatData) return;

    const previewText = buildInjectionText(chatData);
    const previewDisplay = previewText || '(injection is empty)';
    const tokens = estimateTokens(previewText);
    const chars = previewText.length;

    const html = `
        <div class="npc-gen-drawer-toggle${isMenuCollapsed ? '' : ' open'}">
            <span class="npc-gen-title">🎭 NPC Generator</span>
            <i class="npc-gen-arrow fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}"></i>
        </div>

        <div class="npc-gen-content${isMenuCollapsed ? '' : ' open'}">

            <div class="npc-gen-top-row">
                <label class="npc-gen-enable-label">
                    <input type="checkbox" class="npc-gen-checkbox" id="npc-gen-enabled" ${settings.isEnabled ? 'checked' : ''}>
                    Включить расширение
                </label>
            </div>

            <div class="npc-gen-body${settings.isEnabled ? '' : ' disabled'}">

                <div class="npc-gen-row">
                    <label class="npc-gen-row-label">Сеттинг:</label>
                    <select class="npc-gen-select" id="npc-gen-setting">
                        <option value="universal" ${settings.setting === 'universal' ? 'selected' : ''}>Универсальный</option>
                        <option value="medieval" ${settings.setting === 'medieval' ? 'selected' : ''}>Средневековье</option>
                        <option value="modern" ${settings.setting === 'modern' ? 'selected' : ''}>Современность</option>
                        <option value="cyberpunk" ${settings.setting === 'cyberpunk' ? 'selected' : ''}>Киберпанк</option>
                        <option value="space" ${settings.setting === 'space' ? 'selected' : ''}>Космос</option>
                    </select>
                </div>

                <details class="npc-gen-library">
                    <summary class="npc-gen-library-summary">📚 Настройка библиотеки</summary>
                    <div class="npc-gen-library-inner">
                        ${renderCategoryTree(chatData)}
                    </div>
                </details>

                <button id="npc-gen-generate" class="npc-gen-generate-btn">🎲 Сгенерировать NPC</button>

                <div class="npc-gen-list-section">
                    <div class="npc-gen-list-title">Сгенерированные NPC (${chatData.npcs.length})</div>
                    <div class="npc-gen-list">
                        ${renderNpcList(chatData)}
                    </div>
                </div>

                <label class="npc-gen-inject-label">
                    <input type="checkbox" class="npc-gen-checkbox" id="npc-gen-inject" ${settings.injectToPrompt ? 'checked' : ''}>
                    Инъекцировать в промпт модели
                </label>

                <div class="npc-gen-preview-section">
                    <div class="npc-gen-preview-title">
                        Превью инъекции (то, что уходит модели)
                        <span class="npc-gen-token-counter">~${tokens} tokens · ${chars} chars</span>
                    </div>
                    <textarea readonly class="npc-gen-preview">${escapeHtml(previewDisplay)}</textarea>
                    <button id="npc-gen-copy" class="menu_button npc-gen-copy-btn">📋 Скопировать превью</button>
                </div>

                <button id="npc-gen-clear" class="menu_button type_danger npc-gen-clear-btn">Очистить всех NPC</button>
            </div>
        </div>
    `;

    let container = $('#npc-gen-container');
    if (container.length === 0) {
        container = $('<div id="npc-gen-container" class="npc-gen-container"></div>');
        $('#extensions_settings').append(container);
    }
    container.html(html);
}

// ------------------------------------------------------------
// Хелперы для UI-состояния
// ------------------------------------------------------------

function toggleInArray(arr, val, on) {
    const i = arr.indexOf(val);
    if (on) {
        if (i < 0) arr.push(val);
    } else {
        if (i >= 0) arr.splice(i, 1);
    }
}

// ------------------------------------------------------------
// Обработчики
// ------------------------------------------------------------

function bindUiEvents() {
    // Главный тоггл
    $(document).off('click', '.npc-gen-drawer-toggle').on('click', '.npc-gen-drawer-toggle', function() {
        isMenuCollapsed = !isMenuCollapsed;
        $('.npc-gen-content').toggleClass('open', !isMenuCollapsed);
        $(this).toggleClass('open', !isMenuCollapsed);
        $(this).find('.npc-gen-arrow')
            .toggleClass('fa-chevron-down', isMenuCollapsed)
            .toggleClass('fa-chevron-up', !isMenuCollapsed);
    });

    $(document).off('change', '#npc-gen-enabled').on('change', '#npc-gen-enabled', function() {
        settings.isEnabled = $(this).is(':checked');
        saveSettingsDebounced();
        updatePrompt();
        renderUI();
    });

    $(document).off('change', '#npc-gen-setting').on('change', '#npc-gen-setting', function() {
        settings.setting = $(this).val();
        saveSettingsDebounced();
    });

    // Раскрытие категории (клик по заголовку, кроме чекбокса)
    $(document).off('click', '.npc-gen-cat-header').on('click', '.npc-gen-cat-header', function(e) {
        if ($(e.target).is('input[type="checkbox"]')) return;
        const $cat = $(this).closest('.npc-gen-category');
        const catId = $cat.data('cat');
        $cat.toggleClass('open');
        toggleInArray(settings.openCategories, catId, $cat.hasClass('open'));
        saveSettingsDebounced();
    });

    // Раскрытие слота
    $(document).off('click', '.npc-gen-slot-header').on('click', '.npc-gen-slot-header', function(e) {
        if ($(e.target).is('input[type="checkbox"]')) return;
        const $slot = $(this).closest('.npc-gen-slot');
        const slotId = $slot.data('slot');
        $slot.toggleClass('open');
        toggleInArray(settings.openSlots, slotId, $slot.hasClass('open'));
        saveSettingsDebounced();
    });

    // Чекбокс категории
    $(document).off('change', '.npc-cat-cb').on('change', '.npc-cat-cb', function() {
        const catId = $(this).data('cat');
        const chatData = getChatData();
        if (!chatData) return;
        toggleInArray(chatData.overrides.disabledCategories, catId, !this.checked);
        saveSettingsDebounced();
    });

    // Чекбокс слота
    $(document).off('change', '.npc-slot-cb').on('change', '.npc-slot-cb', function() {
        const slotId = $(this).data('slot');
        const chatData = getChatData();
        if (!chatData) return;
        toggleInArray(chatData.overrides.disabledSlots, slotId, !this.checked);
        saveSettingsDebounced();
    });

    // Чекбокс конкретного значения
    $(document).off('change', '.npc-value-cb').on('change', '.npc-value-cb', function() {
        const slotId = $(this).data('slot');
        const valueEn = $(this).data('value');
        const chatData = getChatData();
        if (!chatData) return;
        if (!chatData.overrides.excludedValues[slotId]) {
            chatData.overrides.excludedValues[slotId] = [];
        }
        toggleInArray(chatData.overrides.excludedValues[slotId], valueEn, !this.checked);
        saveSettingsDebounced();
    });

    // Генерация
    $(document).off('click', '#npc-gen-generate').on('click', '#npc-gen-generate', function() {
        const chatData = getChatData();
        if (!chatData) return;
        generateNpc(chatData, settings.setting);
        saveSettingsDebounced();
        updatePrompt();
        renderUI();
    });

    // Чекбокс "в промпт"
    $(document).off('change', '.npc-inprompt-cb').on('change', '.npc-inprompt-cb', function() {
        const id = $(this).data('id');
        const chatData = getChatData();
        if (!chatData) return;
        const npc = chatData.npcs.find(n => n.id === id);
        if (npc) {
            npc.inPrompt = this.checked;
            saveSettingsDebounced();
            updatePrompt();
            renderUI();
        }
    });

    // Раскрытие NPC
    $(document).off('click', '.npc-gen-item-header').on('click', '.npc-gen-item-header', function(e) {
        if ($(e.target).is('input[type="checkbox"]') || $(e.target).is('button')) return;
        const $item = $(this).closest('.npc-gen-item');
        const id = $item.data('id');
        $item.toggleClass('open');
        toggleInArray(settings.openNpcs, id, $item.hasClass('open'));
        saveSettingsDebounced();
    });

    // Удаление
    $(document).off('click', '.npc-delete-btn').on('click', '.npc-delete-btn', function(e) {
        e.stopPropagation();
        const id = $(this).data('id');
        const chatData = getChatData();
        if (!chatData) return;
        const i = chatData.npcs.findIndex(n => n.id === id);
        if (i >= 0) {
            chatData.npcs.splice(i, 1);
            toggleInArray(settings.openNpcs, id, false);
            saveSettingsDebounced();
            updatePrompt();
            renderUI();
        }
    });

    // Чекбокс инъекции
    $(document).off('change', '#npc-gen-inject').on('change', '#npc-gen-inject', function() {
        settings.injectToPrompt = $(this).is(':checked');
        saveSettingsDebounced();
        updatePrompt();
    });

    // Копирование
    $(document).off('click', '#npc-gen-copy').on('click', '#npc-gen-copy', function() {
        const chatData = getChatData();
        if (!chatData) return;
        const text = buildInjectionText(chatData);
        navigator.clipboard.writeText(text).then(() => {
            notify('Превью скопировано в буфер обмена', 'success');
        }).catch(() => {
            notify('Не удалось скопировать', 'error');
        });
    });

    // Очистка
    $(document).off('click', '#npc-gen-clear').on('click', '#npc-gen-clear', function() {
        if (!confirm('Удалить всех NPC в этом чате?')) return;
        const chatData = getChatData();
        if (!chatData) return;
        chatData.npcs = [];
        settings.openNpcs = [];
        saveSettingsDebounced();
        updatePrompt();
        renderUI();
    });
}

// ------------------------------------------------------------
// Инициализация
// ------------------------------------------------------------

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    if (settings.isEnabled === undefined) settings.isEnabled = true;
    if (settings.setting === undefined) settings.setting = 'universal';
    if (settings.injectToPrompt === undefined) settings.injectToPrompt = false;
    if (!settings.chatNpcData) settings.chatNpcData = {};
    if (!Array.isArray(settings.openCategories)) settings.openCategories = [];
    if (!Array.isArray(settings.openSlots)) settings.openSlots = [];
    if (!Array.isArray(settings.openNpcs)) settings.openNpcs = [];
}

function tryInit() {
    const chatId = getCurrentChatId();
    if (!chatId) return false;
    isReady = true;
    renderUI();
    updatePrompt();
    return true;
}

jQuery(async () => {
    bindUiEvents();
    loadSettings();

    if (eventSource?.on && event_types) {
        if (event_types.APP_READY) {
            eventSource.on(event_types.APP_READY, () => tryInit());
        }
        if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => {
                isReady = false;
                tryInit();
            });
        }
    }

    // Fallback: если события не сработали
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        if (tryInit() || attempts > 30) clearInterval(interval);
    }, 500);
});
