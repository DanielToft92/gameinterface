document.getElementById('playGameButton').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.getElementById('optionsButton').addEventListener('click', () => {
    alert('Options button clicked!');
});

document.getElementById('exitGameButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        window.close(); // Close the browser tab/window
    }
});