const input = document.getElementById('textToTranslate');
const resultDiv = document.getElementById('translationResult');

let timeoutId;

input.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(translateText, 500); // Wait for 500ms after user stops typing
});

async function translateText() {
    const text = input.value.trim();
    if (!text) {
        resultDiv.textContent = '';
        return;
    }

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (data && data[0] && data[0][0]) {
            resultDiv.textContent = data[0][0][0];
        }
    } catch (error) {
        console.error('Translation error:', error);
        resultDiv.textContent = '翻译错误，请重试。'; // Translation error, please try again
    }
}