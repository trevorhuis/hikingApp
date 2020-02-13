let enterButton = document.getElementById('button-enter');
let inputForm = document.getElementById('city-input');

enterButton.addEventListener('click', () => {
    if (inputForm.value !== "") {
        window.location.href = `/${inputForm.value}`;
    }
});

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName === 'Enter' && inputForm.value !== "") {
        window.location.href = `/${inputForm.value}`;
    }
});