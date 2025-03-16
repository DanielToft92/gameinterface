// Redirect to game.html when "Play Game" is clicked
document.getElementById('playGameButton').addEventListener('click', () => {
    window.location.href = 'game.html';
});

// Placeholder for "Options" button
document.getElementById('optionsButton').addEventListener('click', () => {
    alert('Options button clicked!');
});

// Exit the game when "Exit Game" is clicked
document.getElementById('exitGameButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        window.close(); // Close the browser tab/window
    }
});