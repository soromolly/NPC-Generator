import {
    saveSettingsDebounced,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { NPC_CATEGORIES, NPC_LIBRARY, getSlotsByCategory } from './library.js';

const EXTENSION_NAME = 'npc-generator';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    language: 'ru',
    setting: 'universal',
    injectToPrompt: false,
    chatNpcData: {}
};

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true;

// ------------------------------------------------------------
// Данные чата
// ------------------------------------------------------------

function getCurrentChatId() {
    if (typeof SillyTavern?.getContext === 'function') {
        return SillyTavern.getContext().chatId || window.chat_id || 'default';
    }
    return window.chat_id || 'default';
}

function createDefaultChatData() {
    return {
        npcs: [],
        overrides: {
            disabledCategories: [],
            disabledSlots: [],
            excludedValues: {}
        }
    };
}

function getChatData() {
    const chatId = getCurrentChatId();
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
// Генерация
// ------------------------------------------------------------

function isSlotEnabled(slot, chatData) {
    const cat = NPC_CATEGORIES[slot.category];
    if (cat?.required) return true;
    if (chatData.overrides.disabledCategories.includes(slot.category)) return false;
    if (chatData.overrides.disabledSlots.includes(slot.id)) return false;
    if (cat?.defaultEnabled === false) return false;
    return true;
}

function matchesSetting(value, setting) {
    if (!value.tags || value.tags.length === 0) return true;
    if (value.tags.includes('universal')) return true;
    if (setting === 'universal') return value.tags.includes('universal');
    return value.tags.includes(setting);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNpcFields(chatData, setting) {
    const fields = {};
    for (const slot of NPC_LIBRARY) {
        if (!isSlotEnabled(slot, chatData)) continue;

        const available = slot.values.filter(v => matchesSetting(v, setting));
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

function buildNpcLine(npc, lang) {
    const parts = [];
    for (const slot of NPC_LIBRARY) {
        const val = npc.fields[slot.id];
        if (!val) continue;
        const text = valueToText(val, lang);
        if (text) parts.push(text);
    }
    return parts.join('; ');
}

function buildNpcLabel(npc, lang) {
    const name = valueToText(npc.fields.name_given, lang);
    const role = valueToText(npc.fields.role, lang);
    if (name && role) return `${name} — ${role}`;
    return name || role || 'NPC';
}

function buildInjectionText(chatData, lang) {
    const active = chatData.npcs.filter(n => n.inPrompt);
    if (!active.length) return '';
    const lines = active.map(npc => `• ${buildNpcLine(npc, lang)}`);
    return `[NPC в сцене]\n${lines.join('\n')}`;
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
    const text = buildInjectionText(chatData, settings.language || 'ru');
    setExtensionPrompt(EXTENSION_NAME, text, extension_prompt_types.IN_CHAT, 0);
}

function notify(text, type = 'info') {
    if (typeof toastr !== 'undefined') {
        toastr[type]?.(text) || toastr.info(text);
    }
}

// ------------------------------------------------------------
// Рендер
// ------------------------------------------------------------

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function renderCategoryTree(chatData, lang) {
    const grouped = getSlotsByCategory();
    let html = '';

    for (const [catId, cat] of Object.entries(NPC_CATEGORIES)) {
        const slots = grouped[catId] || [];
        if (!slots.length) continue;

        const catDisabled = chatData.overrides.disabledCategories.includes(catId);
        const catChecked = cat.required ? true : !catDisabled;
        const requiredAttr = cat.required ? 'disabled' : '';
        const labelClass = cat.required ? 'npc-gen-cat-label required' : 'npc-gen-cat-label';

        html += `
            <div class="npc-gen-category">
                <label class="${labelClass}">
                    <input type="checkbox" class="npc-gen-checkbox-sm npc-cat-cb" data-cat="${catId}" ${catChecked ? 'checked' : ''} ${requiredAttr}>
                    <span class="npc-gen-cat-name">${escapeHtml(cat.label[lang] || cat.label.ru)}</span>
                    ${cat.required ? '<span class="npc-gen-cat-required">(обязательно)</span>' : ''}
                </label>
                <div class="npc-gen-slots">
                    ${slots.map(slot => {
                        const slotDisabled = chatData.overrides.disabledSlots.includes(slot.id);
                        return `
                            <label class="npc-gen-slot-label">
                                <input type="checkbox" class="npc-gen-checkbox-sm npc-slot-cb" data-slot="${slot.id}" ${(!slotDisabled) ? 'checked' : ''}>
                                <span>${escapeHtml(slot.label[lang] || slot.label.ru)}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    return html;
}

function renderNpcList(chatData, lang) {
    if (!chatData.npcs.length) {
        return `<div class="npc-gen-empty">NPC пока не сгенерированы.</div>`;
    }
    return chatData.npcs.map(npc => `
        <div class="npc-gen-item">
            <input type="checkbox" class="npc-gen-checkbox-sm npc-inprompt-cb" data-id="${npc.id}" ${npc.inPrompt ? 'checked' : ''}>
            <div class="npc-gen-item-label">${escapeHtml(buildNpcLabel(npc, lang))}</div>
            <button class="npc-gen-delete-btn npc-delete-btn" data-id="${npc.id}">×</button>
        </div>
    `).join('');
}

function renderUI() {
    const lang = settings.language || 'ru';
    const chatData = getChatData();
    const previewText = buildInjectionText(chatData, lang) || '(инъекция пуста)';

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
                <select class="npc-gen-lang-select" id="npc-gen-lang">
                    <option value="ru" ${settings.language === 'ru' ? 'selected' : ''}>RU</option>
                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>EN</option>
                </select>
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
                        <option value="omegaverse" ${settings.setting === 'omegaverse' ? 'selected' : ''}>Омегаверс</option>
                        <option value="oviposition" ${settings.setting === 'oviposition' ? 'selected' : ''}>Яйцекладка</option>
                    </select>
                </div>

                <details class="npc-gen-library">
                    <summary class="npc-gen-library-summary">📚 Настройка библиотеки</summary>
                    <div class="npc-gen-library-inner">
                        ${renderCategoryTree(chatData, lang)}
                    </div>
                </details>

                <button id="npc-gen-generate" class="npc-gen-generate-btn">🎲 Сгенерировать NPC</button>

                <div class="npc-gen-list-section">
                    <div class="npc-gen-list-title">Сгенерированные NPC (${chatData.npcs.length})</div>
                    <div class="npc-gen-list">
                        ${renderNpcList(chatData, lang)}
                    </div>
                </div>

                <label class="npc-gen-inject-label">
                    <input type="checkbox" class="npc-gen-checkbox" id="npc-gen-inject" ${settings.injectToPrompt ? 'checked' : ''}>
                    Инъекцировать в промпт модели
                </label>

                <div class="npc-gen-preview-section">
                    <div class="npc-gen-preview-title">Превью инъекции</div>
                    <textarea readonly class="npc-gen-preview">${escapeHtml(previewText)}</textarea>
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
// Обработчики
// ------------------------------------------------------------

function bindUiEvents() {
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

    $(document).off('change', '#npc-gen-lang').on('change', '#npc-gen-lang', function() {
        settings.language = $(this).val();
        saveSettingsDebounced();
        renderUI();
        updatePrompt();
    });

    $(document).off('change', '#npc-gen-setting').on('change', '#npc-gen-setting', function() {
        settings.setting = $(this).val();
        saveSettingsDebounced();
    });

    $(document).off('change', '.npc-cat-cb').on('change', '.npc-cat-cb', function() {
        const catId = $(this).data('cat');
        const chatData = getChatData();
        const list = chatData.overrides.disabledCategories;
        if (this.checked) {
            const i = list.indexOf(catId);
            if (i >= 0) list.splice(i, 1);
        } else {
            if (!list.includes(catId)) list.push(catId);
        }
        saveSettingsDebounced();
    });

    $(document).off('change', '.npc-slot-cb').on('change', '.npc-slot-cb', function() {
        const slotId = $(this).data('slot');
        const chatData = getChatData();
        const list = chatData.overrides.disabledSlots;
        if (this.checked) {
            const i = list.indexOf(slotId);
            if (i >= 0) list.splice(i, 1);
        } else {
            if (!list.includes(slotId)) list.push(slotId);
        }
        saveSettingsDebounced();
    });

    $(document).off('click', '#npc-gen-generate').on('click', '#npc-gen-generate', function() {
        const chatData = getChatData();
        generateNpc(chatData, settings.setting);
        saveSettingsDebounced();
        updatePrompt();
        renderUI();
    });

    $(document).off('change', '.npc-inprompt-cb').on('change', '.npc-inprompt-cb', function() {
        const id = $(this).data('id');
        const chatData = getChatData();
        const npc = chatData.npcs.find(n => n.id === id);
        if (npc) {
            npc.inPrompt = this.checked;
            saveSettingsDebounced();
            updatePrompt();
            renderUI();
        }
    });

    $(document).off('click', '.npc-delete-btn').on('click', '.npc-delete-btn', function() {
        const id = $(this).data('id');
        const chatData = getChatData();
        const i = chatData.npcs.findIndex(n => n.id === id);
        if (i >= 0) {
            chatData.npcs.splice(i, 1);
            saveSettingsDebounced();
            updatePrompt();
            renderUI();
        }
    });

    $(document).off('change', '#npc-gen-inject').on('change', '#npc-gen-inject', function() {
        settings.injectToPrompt = $(this).is(':checked');
        saveSettingsDebounced();
        updatePrompt();
    });

    $(document).off('click', '#npc-gen-copy').on('click', '#npc-gen-copy', function() {
        const chatData = getChatData();
        const text = buildInjectionText(chatData, settings.language || 'ru');
        navigator.clipboard.writeText(text).then(() => {
            notify('Превью скопировано в буфер обмена', 'success');
        }).catch(() => {
            notify('Не удалось скопировать', 'error');
        });
    });

    $(document).off('click', '#npc-gen-clear').on('click', '#npc-gen-clear', function() {
        if (!confirm('Удалить всех NPC в этом чате?')) return;
        const chatData = getChatData();
        chatData.npcs = [];
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
    if (settings.language === undefined) settings.language = 'ru';
    if (settings.setting === undefined) settings.setting = 'universal';
    if (settings.injectToPrompt === undefined) settings.injectToPrompt = false;
    if (!settings.chatNpcData) settings.chatNpcData = {};
    renderUI();
    updatePrompt();
}

jQuery(async () => {
    bindUiEvents();
    loadSettings();
});
