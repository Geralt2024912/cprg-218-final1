const input = document.getElementById('textToTranslate');
const resultDiv = document.getElementById('translationResult');

function handleCheckIn(event) {
    event.preventDefault();
    const nameInput = document.getElementById('checkinName');
    const name = nameInput.value.trim();
    const statusOutput = document.getElementById('checkinStatus');
    const streakOutput = document.getElementById('checkinStreak');

    if (!name) {
        statusOutput.innerHTML = '<span class="error">Please enter your name</span>';
        return;
    }

    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toDateString();
    let streak = parseInt(localStorage.getItem('streak')) || 0;

    if (lastCheckIn === today) {
        statusOutput.innerHTML = '<span class="error">You have already checked in today!</span>';
        return;
    }

    if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate.toDateString() === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }
    } else {
        streak = 1;
    }

    localStorage.setItem('lastCheckIn', today);
    localStorage.setItem('streak', streak);

    statusOutput.innerHTML = '<span class="success">Check-in successful!</span>';
    streakOutput.textContent = `Current streak: ${streak} day${streak === 1 ? '' : 's'}`;
    nameInput.value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    nav.insertBefore(hamburger, nav.firstChild);

    const navButtons = document.querySelector('.nav-buttons');
    hamburger.addEventListener('click', function() {
        navButtons.classList.toggle('active');
        hamburger.innerHTML = navButtons.classList.contains('active') ? '✕' : '☰';
    });

    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && navButtons.classList.contains('active')) {
            navButtons.classList.remove('active');
            hamburger.innerHTML = '☰';
        }
    });

    const textInput = document.getElementById('textToTranslate');
    if (textInput) {
        textInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                const resultDiv = document.getElementById('translationResult');
                if (!this.value.trim()) {
                    resultDiv.textContent = 'Please enter text to translate';
                    return;
                }

                try {
                    const response = await fetch('https://api.mymemory.translated.net/get?' + new URLSearchParams({
                        q: this.value,
                        langpair: 'en|zh-CN'
                    }));

                    const data = await response.json();
                    if (data.responseData) {
                        resultDiv.textContent = data.responseData.translatedText;
                    } else {
                        resultDiv.textContent = 'Translation failed. Please try again.';
                    }
                } catch (error) {
                    resultDiv.textContent = 'Error: ' + error.message;
                }
            }
        });
    }
});