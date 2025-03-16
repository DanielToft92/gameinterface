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

            actionButtons.forEach(btn => {
                if (btn.querySelector('.spell-name').textContent === spellName) {
                    btn.querySelector('.spell-name').textContent = '';
                }
            });

            button.querySelector('.spell-name').textContent = spellName;

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
                }
            });

            saveActionBars();
        }
    });

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
        });
    }

    loadActionBars();
});