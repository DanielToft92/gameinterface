document.addEventListener("DOMContentLoaded", () => {
    // Cache frequently used DOM elements
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');
    const addTab = document.querySelector('.add-tab');
    const timeDisplay = document.querySelector('.time-display');
    const spellbookButton = document.querySelector('.menu-button img[alt="spellbook"]')?.parentElement;
    const spellbookPopup = document.getElementById('spellbookPopup');
    const closeSpellbookButton = document.getElementById('closeSpellbook');
    const questlogButton = document.querySelector('.menu-button img[alt="questlog"]')?.parentElement;
    const questlogPopup = document.getElementById('questlogPopup');
    const closeQuestlogButton = document.getElementById('closeQuestlog');
    const popupMenu = document.getElementById('popupMenu');
    const gameSettingsButton = document.querySelector('.menu-button img[alt="system"]')?.parentElement;
    const backToGameButton = document.getElementById('backToGameButton');
    const backToMainMenuButton = document.getElementById('backToMainMenuButton');
    const spells = document.querySelectorAll('.spell');
    const actionButtons = document.querySelectorAll('.action-button');
    const notificationContainer = document.querySelector('.notification-container');

    // Configuration objects
    const spellsMap = {
        '1': null, '2': null, '3': null, '4': null, '5': null,
        '6': null, '7': null, '8': null, '9': null,
        'alt+1': null, 'alt+2': null, 'alt+3': null, 'alt+4': null,
        'alt+5': null, 'alt+6': null, 'alt+7': null, 'alt+8': null, 'alt+9': null,
    };

    const spellCooldowns = {};

    // Generic function to toggle popups
    function togglePopup(popup) {
        if (popup.style.display === 'flex') {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'flex';
        }
    }

    // Chat functionality
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const newMessage = document.createElement('p');
            newMessage.textContent = `Spiller: ${chatInput.value}`;
            chatMessages.appendChild(newMessage);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // Add tab functionality
    addTab.addEventListener('click', () => {
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        newTab.textContent = 'Ny Tab';
        document.querySelector('.chat-tabs').insertBefore(newTab, addTab);
    });

    // Generic button click handler
    function handleButtonClick(selector, logMessage) {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', () => {
                console.log(`${logMessage}: ${button.querySelector('img').alt}`);
            });
        });
    }

    handleButtonClick('.menu-button', 'Button clicked');
    handleButtonClick('.bag-button', 'Bag button clicked');

    // Time display functionality
    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Spellbook functionality
    if (spellbookButton && spellbookPopup && closeSpellbookButton) {
        spellbookButton.addEventListener('click', () => togglePopup(spellbookPopup));
        closeSpellbookButton.addEventListener('click', () => togglePopup(spellbookPopup));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') togglePopup(spellbookPopup);
    });

    // Questlog functionality
    if (questlogButton && questlogPopup && closeQuestlogButton) {
        questlogButton.addEventListener('click', () => togglePopup(questlogPopup));
        closeQuestlogButton.addEventListener('click', () => togglePopup(questlogPopup));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'l' || e.key === 'L') togglePopup(questlogPopup);
    });

    // Spell drag-and-drop functionality
    spells.forEach(spell => {
        spell.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.spell);
        });
    });

    actionButtons.forEach(button => {
        button.addEventListener('drop', (e) => {
            e.preventDefault();
            const spellName = e.dataTransfer.getData('text/plain');
            const key = button.dataset.key;

            const oldButton = Array.from(actionButtons).find(btn => btn.querySelector('.spell-name').textContent === spellName);
            if (oldButton) {
                oldButton.querySelector('.spell-name').textContent = '';
                spellsMap[oldButton.dataset.key] = null;
                const oldCooldownOverlay = oldButton.querySelector('.cooldown-overlay');
                if (oldCooldownOverlay) oldCooldownOverlay.style.display = 'none';
            }

            button.querySelector('.spell-name').textContent = spellName;
            spellsMap[key] = spellName;

            const cooldownOverlay = button.querySelector('.cooldown-overlay');
            if (cooldownOverlay) {
                cooldownOverlay.style.display = spellCooldowns[spellName]?.isOnCooldown ? 'flex' : 'none';
                cooldownOverlay.textContent = spellCooldowns[spellName]?.timeLeft || '';
            }

            saveActionBars();
        });

        button.addEventListener('dragstart', (e) => {
            const spellName = button.querySelector('.spell-name').textContent;
            if (spellName) e.dataTransfer.setData('text/plain', spellName);
        });
    });

    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    // Spell activation functionality
    document.addEventListener('keydown', (e) => {
        let key = e.altKey ? `alt+${e.key}` : e.key;
        const spell = spellsMap[key];
        if (spell) activateSpell(spell, key);
    });

    function activateSpell(spell, key) {
        const playerInfo = document.querySelector('.player-info');
        const actionButton = document.querySelector(`.action-button[data-key="${key}"]`);
        const cooldownOverlay = actionButton?.querySelector('.cooldown-overlay');

        if (spell === 'Barrier' && spellCooldowns[spell]?.isOnCooldown) {
            showNotification('Barrier is on cooldown');
            return;
        }

        showNotification(`You cast ${spell}`);

        switch (spell) {
            case 'Barrier':
                playerInfo.classList.add('barrier-active');
                spellCooldowns[spell] = { isOnCooldown: true, timeLeft: 30, interval: null };
                if (cooldownOverlay) {
                    cooldownOverlay.style.display = 'flex';
                    cooldownOverlay.textContent = '30';
                    startCooldownTimer(spell, 30);
                }
                setTimeout(() => playerInfo.classList.remove('barrier-active'), 15000);
                setTimeout(() => spellCooldowns[spell].isOnCooldown = false, 30000);
                break;
            case 'Fireball':
            case 'Heal':
            case 'Blink':
                showNotification(`${spell} casted`);
                break;
        }
    }

    function startCooldownTimer(spell, duration) {
        let timeLeft = duration;
        spellCooldowns[spell].interval = setInterval(() => {
            timeLeft--;
            spellCooldowns[spell].timeLeft = timeLeft;

            const currentButton = Object.entries(spellsMap).find(([key, value]) => value === spell)?.[0];
            if (currentButton) {
                const cooldownOverlay = document.querySelector(`.action-button[data-key="${currentButton}"] .cooldown-overlay`);
                if (cooldownOverlay) {
                    cooldownOverlay.textContent = timeLeft;
                    if (timeLeft <= 0) cooldownOverlay.style.display = 'none';
                }
            }

            if (timeLeft <= 0) clearInterval(spellCooldowns[spell].interval);
        }, 1000);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function saveActionBars() {
        const actionBarState = Array.from(actionButtons).map(button => button.querySelector('.spell-name').textContent);
        localStorage.setItem('actionBarState', JSON.stringify(actionBarState));
    }

    function loadActionBars() {
        const actionBarState = JSON.parse(localStorage.getItem('actionBarState')) || [];
        actionButtons.forEach((button, index) => {
            const spellName = actionBarState[index] || '';
            button.querySelector('.spell-name').textContent = spellName;
            spellsMap[button.dataset.key] = spellName;
        });
    }

    loadActionBars();

    if (gameSettingsButton) gameSettingsButton.addEventListener('click', () => togglePopup(popupMenu));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') togglePopup(popupMenu);
    });
    backToGameButton.addEventListener('click', () => togglePopup(popupMenu));
    backToMainMenuButton.addEventListener('click', () => window.location.href = 'index.html');

    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const quest = e.target.closest('.quest');
            const details = quest.querySelector('.quest-details');
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            e.target.textContent = details.style.display === 'block' ? '▲' : '▼';
        });
    });
});