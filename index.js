document.getElementById('playGameButton').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.getElementById('settingsButton').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

document.getElementById('exitGameButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        window.close();
    }
});