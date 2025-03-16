document.addEventListener("DOMContentLoaded", () => {
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const backToGameButton = document.getElementById('backToGameButton');

    // Save settings
    saveSettingsButton.addEventListener('click', () => {
        const volume = document.getElementById('volume').value;
        const brightness = document.getElementById('brightness').value;
        const resolution = document.getElementById('resolution').value;
        const fullscreen = document.getElementById('fullscreen').checked;

        // Save settings to localStorage (or send to server)
        localStorage.setItem('volume', volume);
        localStorage.setItem('brightness', brightness);
        localStorage.setItem('resolution', resolution);
        localStorage.setItem('fullscreen', fullscreen);

        alert('Settings saved!');
    });

    // Back to game
    backToGameButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Load saved settings
    const volume = localStorage.getItem('volume') || 50;
    const brightness = localStorage.getItem('brightness') || 50;
    const resolution = localStorage.getItem('resolution') || '1080p';
    const fullscreen = localStorage.getItem('fullscreen') === 'true';

    document.getElementById('volume').value = volume;
    document.getElementById('brightness').value = brightness;
    document.getElementById('resolution').value = resolution;
    document.getElementById('fullscreen').checked = fullscreen;
});