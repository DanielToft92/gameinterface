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
        alert(`Åbner: ${this.textContent}`);
    });
});

const bagButtons = document.querySelectorAll('.bag-button');
bagButtons.forEach(button => {
    button.addEventListener('click', function () {
        const altText = this.querySelector('img').alt;
        alert(`Åbner: ${altText}`);
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