let enterButton = document.getElementById('button-enter');
let inputForm = document.getElementById('city-input');
let dateTime = document.getElementsByClassName('date-and-time');

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

var getDate = () => {
    let date, days, month, year, monthsArray;

    monthsArray= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

    date = new Date();

    days = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    date = `${monthsArray[month]} ${days}, ${year} `;

    dateTime[0].innerHTML += date;

}

getDate();