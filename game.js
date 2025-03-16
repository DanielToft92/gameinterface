document.addEventListener("DOMContentLoaded", () => {
    // Chat Input Functionality
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const message = chatInput.value;
            if (message.trim() !== '') {
                const newMessage = document.createElement('p');
                newMessage.textContent = `Spiller: ${message}`;
                chatMessages.appendChild(newMessage);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    });

    const addTab = document.querySelector('.add-tab');
    addTab.addEventListener('click', function () {
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        newTab.textContent = 'Ny Tab';
        document.querySelector('.chat-tabs').insertBefore(newTab, addTab);
    });

    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log(`Button clicked: ${this.querySelector('img').alt}`);
        });
    });

    const bagButtons = document.querySelectorAll('.bag-button');
    bagButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log(`Bag button clicked: ${this.querySelector('img').alt}`);
        });
    });

    function updateTime() {
        const timeDisplay = document.querySelector('.time-display');
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        timeDisplay.textContent = timeString;
    }

    setInterval(updateTime, 1000);
    updateTime();

    const spellbookButton = document.querySelector('.menu-button img[alt="spellbook"]')?.parentElement;
    const spellbookPopup = document.getElementById('spellbookPopup');
    const closeSpellbookButton = document.getElementById('closeSpellbook');

    function toggleSpellbook() {
        if (spellbookPopup) {
            if (spellbookPopup.style.display === 'flex') {
                spellbookPopup.style.display = 'none';
            } else {
                spellbookPopup.style.display = 'flex';
            }
        }
    }

    if (spellbookButton && spellbookPopup && closeSpellbookButton) {
        spellbookButton.addEventListener('click', toggleSpellbook);
        closeSpellbookButton.addEventListener('click', () => {
            spellbookPopup.style.display = 'none'; // Close the spellbook
        });
    } else {
        console.error("Spellbook button or popup not found!");
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            toggleSpellbook();
        }
    });

    const spells = document.querySelectorAll('.spell');
    const actionButtons = document.querySelectorAll('.action-button');

    // Track spells assigned to keys
    const spellsMap = {
        '1': null,
        '2': null,
        '3': null,
        '4': null,
        '5': null,
        '6': null,
        '7': null,
        '8': null,
        '9': null,
        'alt+1': null,
        'alt+2': null,
        'alt+3': null,
        'alt+4': null,
        'alt+5': null,
        'alt+6': null,
        'alt+7': null,
        'alt+8': null,
        'alt+9': null,
    };

    const spellCooldowns = {};

    spells.forEach(spell => {
        spell.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.spell);
        });
    });

    actionButtons.forEach(button => {
        button.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        button.addEventListener('drop', (e) => {
            e.preventDefault();
            const spellName = e.dataTransfer.getData('text/plain');
            const key = button.dataset.key;

            actionButtons.forEach(btn => {
                if (btn.querySelector('.spell-name').textContent === spellName) {
                    btn.querySelector('.spell-name').textContent = '';
                    spellsMap[btn.dataset.key] = null;

                    const oldCooldownOverlay = btn.querySelector('.cooldown-overlay');
                    if (oldCooldownOverlay) {
                        oldCooldownOverlay.style.display = 'none';
                    }
                }
            });

            button.querySelector('.spell-name').textContent = spellName;

            spellsMap[key] = spellName;

            if (spellCooldowns[spellName]) {
                const cooldownOverlay = button.querySelector('.cooldown-overlay');
                if (cooldownOverlay) {
                    cooldownOverlay.style.display = 'flex';
                    cooldownOverlay.textContent = spellCooldowns[spellName].timeLeft;
                }
            }

            saveActionBars();
        });

        button.addEventListener('dragstart', (e) => {
            const spellName = button.querySelector('.spell-name').textContent;
            if (spellName) {
                e.dataTransfer.setData('text/plain', spellName);
            }
        });
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const spellName = e.dataTransfer.getData('text/plain');
        const actionBar = document.querySelector('.action-bars');

        if (!actionBar.contains(e.target)) {
            actionButtons.forEach(button => {
                if (button.querySelector('.spell-name').textContent === spellName) {
                    button.querySelector('.spell-name').textContent = '';
                    spellsMap[button.dataset.key] = null; // Clear the key in the spells map

                    // Clear the cooldown overlay
                    const cooldownOverlay = button.querySelector('.cooldown-overlay');
                    if (cooldownOverlay) {
                        cooldownOverlay.style.display = 'none';
                    }
                }
            });

            saveActionBars();
        }
    });

    document.addEventListener('keydown', (e) => {
        let key = e.key;

        if (e.altKey) {
            key = `alt+${key}`;
        }

        const spell = spellsMap[key];
        if (spell) {
            activateSpell(spell, key);
        }
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
                showNotification('You are now shielded from incoming damage');
                playerInfo.classList.add('barrier-active');

                spellCooldowns[spell] = {
                    isOnCooldown: true,
                    timeLeft: 30,
                    interval: null,
                };

                if (cooldownOverlay) {
                    cooldownOverlay.style.display = 'flex';
                    cooldownOverlay.textContent = '30';
                    startCooldownTimer(spell, 30);
                }

                setTimeout(() => {
                    playerInfo.classList.remove('barrier-active');
                    showNotification('Your barrier has worn off');
                }, 15000);

                setTimeout(() => {
                    spellCooldowns[spell].isOnCooldown = false;
                    showNotification('Barrier is ready');
                }, 30000);
                break;
            case 'Fireball':
                showNotification('You cast a fireball');
                break;
            case 'Heal':
                showNotification('You healed yourself');
                break;
            case 'Blink':
                showNotification('You blinked to a new location');
                break;
            default:
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

                    if (timeLeft <= 0) {
                        cooldownOverlay.style.display = 'none';
                    }
                }
            }

            if (timeLeft <= 0) {
                clearInterval(spellCooldowns[spell].interval);
                spellCooldowns[spell].isOnCooldown = false;
            }
        }, 1000);
    }

    function showNotification(message) {
        const notificationContainer = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function saveActionBars() {
        const actionBarState = [];
        actionButtons.forEach(button => {
            const spellName = button.querySelector('.spell-name').textContent;
            actionBarState.push(spellName);
        });
        localStorage.setItem('actionBarState', JSON.stringify(actionBarState));
    }

    function loadActionBars() {
        const actionBarState = JSON.parse(localStorage.getItem('actionBarState')) || [];
        actionButtons.forEach((button, index) => {
            const spellName = actionBarState[index] || '';
            button.querySelector('.spell-name').textContent = spellName;

            const key = button.dataset.key;
            spellsMap[key] = spellName;
        });
    }

    loadActionBars();
});