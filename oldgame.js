// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {

    // Select the chat input and chat messages elements
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    // Add an event listener to the chat input to handle the 'Enter' key press
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const message = chatInput.value;
            if (message.trim() !== '') {
                // Create a new paragraph element for the message
                const newMessage = document.createElement('p');
                newMessage.textContent = `Spiller: ${message}`;
                // Append the new message to the chat messages container
                chatMessages.appendChild(newMessage);
                // Clear the chat input
                chatInput.value = '';
                // Scroll to the bottom of the chat messages
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    });

    // Select the 'Add Tab' button
    const addTab = document.querySelector('.add-tab');
    // Add an event listener to the 'Add Tab' button to create a new tab
    addTab.addEventListener('click', function () {
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        newTab.textContent = 'Ny Tab';
        // Insert the new tab before the 'Add Tab' button
        document.querySelector('.chat-tabs').insertBefore(newTab, addTab);
    });

    // Select all menu buttons
    const menuButtons = document.querySelectorAll('.menu-button');
    // Add an event listener to each menu button to log the button's alt text when clicked
    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log(`Button clicked: ${this.querySelector('img').alt}`);
        });
    });

    // Select all bag buttons
    const bagButtons = document.querySelectorAll('.bag-button');
    // Add an event listener to each bag button to log the button's alt text when clicked
    bagButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log(`Bag button clicked: ${this.querySelector('img').alt}`);
        });
    });

    // Function to update the time display
    function updateTime() {
        const timeDisplay = document.querySelector('.time-display');
        const now = new Date();

        // Format the hours and minutes to always be two digits
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // Update the time display with the current time
        timeDisplay.textContent = timeString;
    }

    // Update the time every second
    setInterval(updateTime, 1000);
    // Call updateTime immediately to set the initial time
    updateTime();

    // Select the spellbook button, spellbook popup, and close spellbook button
    const spellbookButton = document.querySelector('.menu-button img[alt="spellbook"]')?.parentElement;
    const spellbookPopup = document.getElementById('spellbookPopup');
    const closeSpellbookButton = document.getElementById('closeSpellbook');

    // Function to toggle the visibility of the spellbook popup
    function toggleSpellbook() {
        if (spellbookPopup) {
            if (spellbookPopup.style.display === 'flex') {
                spellbookPopup.style.display = 'none';
            } else {
                spellbookPopup.style.display = 'flex';
            }
        }
    }

    // Add event listeners to the spellbook button and close button to toggle the spellbook popup
    if (spellbookButton && spellbookPopup && closeSpellbookButton) {
        spellbookButton.addEventListener('click', toggleSpellbook);
        closeSpellbookButton.addEventListener('click', () => {
            spellbookPopup.style.display = 'none';
        });
    } else {
        console.error("Spellbook button or popup not found!");
    }

    // Add an event listener to the document to toggle the spellbook popup when 'p' or 'P' is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            toggleSpellbook();
        }
    });

    // Select all spell elements and action buttons
    const spells = document.querySelectorAll('.spell');
    const actionButtons = document.querySelectorAll('.action-button');

    // Map to store the association between keys and spells
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

    // Object to store cooldown information for spells
    const spellCooldowns = {};

    // Add a dragstart event listener to each spell to set the data being dragged
    spells.forEach(spell => {
        spell.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.spell);
        });
    });

    // Add a drop event listener to each action button to handle spell assignment
    actionButtons.forEach(button => {
        button.addEventListener('drop', (e) => {
            e.preventDefault();
            const spellName = e.dataTransfer.getData('text/plain');
            const key = button.dataset.key;

            // Find the button that previously had the spell assigned
            const oldButton = Array.from(actionButtons).find(btn => btn.querySelector('.spell-name').textContent === spellName);

            if (oldButton) {
                // Clear the old button's spell name and cooldown overlay
                oldButton.querySelector('.spell-name').textContent = '';
                spellsMap[oldButton.dataset.key] = null;

                const oldCooldownOverlay = oldButton.querySelector('.cooldown-overlay');
                if (oldCooldownOverlay) {
                    oldCooldownOverlay.style.display = 'none';
                    oldCooldownOverlay.textContent = '';
                }
            }

            // Assign the spell to the new button
            button.querySelector('.spell-name').textContent = spellName;
            spellsMap[key] = spellName;

            // Update the cooldown overlay if the spell is on cooldown
            if (spellCooldowns[spellName]?.isOnCooldown) {
                const cooldownOverlay = button.querySelector('.cooldown-overlay');
                if (cooldownOverlay) {
                    cooldownOverlay.style.display = 'flex';
                    cooldownOverlay.textContent = spellCooldowns[spellName].timeLeft;
                }
            } else {
                const cooldownOverlay = button.querySelector('.cooldown-overlay');
                if (cooldownOverlay) {
                    cooldownOverlay.style.display = 'none';
                    cooldownOverlay.textContent = '';
                }
            }

            // Save the current state of the action bars
            saveActionBars();
        });

        // Add a dragstart event listener to each action button to handle dragging spells
        button.addEventListener('dragstart', (e) => {
            const spellName = button.querySelector('.spell-name').textContent;
            if (spellName) {
                e.dataTransfer.setData('text/plain', spellName);
            }
        });
    });

    // Prevent default dragover behavior to allow dropping
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Handle dropping spells outside of action buttons
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const spellName = e.dataTransfer.getData('text/plain');
        const actionBar = document.querySelector('.action-bars');

        if (!actionBar.contains(e.target)) {
            actionButtons.forEach(button => {
                if (button.querySelector('.spell-name').textContent === spellName) {
                    button.querySelector('.spell-name').textContent = '';
                    spellsMap[button.dataset.key] = null;

                    // Clear the cooldown overlay
                    const cooldownOverlay = button.querySelector('.cooldown-overlay');
                    if (cooldownOverlay) {
                        cooldownOverlay.style.display = 'none';
                    }
                }
            });

            // Save the current state of the action bars
            saveActionBars();
        }
    });

    // Add an event listener to the document to handle keydown events for spell activation
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

    // Function to activate a spell
    function activateSpell(spell, key) {
        const playerInfo = document.querySelector('.player-info');
        const actionButton = document.querySelector(`.action-button[data-key="${key}"]`);
        const cooldownOverlay = actionButton?.querySelector('.cooldown-overlay');

        // Check if the spell is on cooldown
        if (spell === 'Barrier' && spellCooldowns[spell]?.isOnCooldown) {
            showNotification('Barrier is on cooldown');
            return;
        }

        // Show a notification that the spell has been cast
        showNotification(`You cast ${spell}`);

        // Handle different spells
        switch (spell) {
            case 'Barrier':
                showNotification('You are now shielded from incoming damage');
                playerInfo.classList.add('barrier-active');

                // Set the cooldown for the Barrier spell
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

                // Remove the barrier after 15 seconds
                setTimeout(() => {
                    playerInfo.classList.remove('barrier-active');
                    showNotification('Your barrier has worn off');
                }, 15000);

                // Reset the cooldown after 30 seconds
                setTimeout(() => {
                    spellCooldowns[spell].isOnCooldown = false;
                    showNotification('Barrier is ready');
                }, 30000);
                break;
            case 'Fireball':
                showNotification('Fireball casted');
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

    // Function to start a cooldown timer for a spell
    function startCooldownTimer(spell, duration) {
        let timeLeft = duration;
        spellCooldowns[spell].interval = setInterval(() => {
            timeLeft--;
            spellCooldowns[spell].timeLeft = timeLeft;

            // Update the cooldown overlay for the spell
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

            // Clear the interval when the cooldown is over
            if (timeLeft <= 0) {
                clearInterval(spellCooldowns[spell].interval);
                spellCooldowns[spell].isOnCooldown = false;
            }
        }, 1000);
    }

    // Function to show a notification
    function showNotification(message) {
        const notificationContainer = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Function to save the current state of the action bars to localStorage
    function saveActionBars() {
        const actionBarState = [];
        actionButtons.forEach(button => {
            const spellName = button.querySelector('.spell-name').textContent;
            actionBarState.push(spellName);
        });
        localStorage.setItem('actionBarState', JSON.stringify(actionBarState));
    }

    // Function to load the saved state of the action bars from localStorage
    function loadActionBars() {
        const actionBarState = JSON.parse(localStorage.getItem('actionBarState')) || [];
        actionButtons.forEach((button, index) => {
            const spellName = actionBarState[index] || '';
            button.querySelector('.spell-name').textContent = spellName;

            const key = button.dataset.key;
            spellsMap[key] = spellName;
        });
    }

    // Load the action bars when the script runs
    loadActionBars();

    // Select the popup menu and game settings button
    const popupMenu = document.getElementById('popupMenu');
    const gameSettingsButton = document.querySelector('.menu-button img[alt="system"]')?.parentElement;

    // Function to toggle the visibility of the popup menu
    function togglePopupMenu() {
        if (popupMenu.style.display === 'flex') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'flex';
        }
    }

    // Add an event listener to the document to toggle the popup menu when 'Escape' is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePopupMenu();
        }
    });

    // Add an event listener to the game settings button to toggle the popup menu
    if (gameSettingsButton) {
        gameSettingsButton.addEventListener('click', togglePopupMenu);
    }

    // Select the back to game button and add an event listener to close the popup menu
    const backToGameButton = document.getElementById('backToGameButton');
    backToGameButton.addEventListener('click', () => {
        popupMenu.style.display = 'none'; // Close the popup menu
    });

    // Select the back to main menu button and add an event listener to redirect to the main menu
    const backToMainMenuButton = document.getElementById('backToMainMenuButton');
    backToMainMenuButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

// Add event listeners to all toggle-details buttons to show/hide quest details
document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const quest = e.target.closest('.quest');
        const details = quest.querySelector('.quest-details');
        details.style.display = details.style.display === 'block' ? 'none' : 'block';
        e.target.textContent = details.style.display === 'block' ? '▲' : '▼';
    });
});

// Select the questlog button, questlog popup, and close questlog button
const questlogButton = document.querySelector('.menu-button img[alt="questlog"]')?.parentElement;
const questlogPopup = document.getElementById('questlogPopup');
const closeQuestlogButton = document.getElementById('closeQuestlog');

// Function to toggle the visibility of the questlog popup
function toggleQuestlog() {
    if (questlogPopup.style.display === 'flex') {
        questlogPopup.style.display = 'none';
    } else {
        questlogPopup.style.display = 'flex';
    }
}

// Add event listeners to the questlog button and close button to toggle the questlog popup
if (questlogButton && questlogPopup && closeQuestlogButton) {
    questlogButton.addEventListener('click', toggleQuestlog);
    closeQuestlogButton.addEventListener('click', toggleQuestlog);
}

// Add an event listener to the document to toggle the questlog popup when 'l' or 'L' is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
        toggleQuestlog();
    }
});