const request = require('request-promise');

let formatWeatherAPIresponseData = json => {

    let forecastData = formatForecastData(json.list.slice(1, 21), json.city.timezone)

    let forecasts = forecastData[0];
    let firstForecast = forecastData[1];

    let weatherData = {
        forecasts: forecasts,
        firstForecast: firstForecast,
        lat: json.city.coord.lat,
        lon: json.city.coord.lon,
        city: json.city.name
    }

    return weatherData;
}

let formatForecastData = (json, timezone) => {
    let forecasts = [];

    let firstWeather = json.shift();

    let firstForecast = formatIndividualForecastData(firstWeather, timezone);

    for (item of json) {
        forecasts.push(formatIndividualForecastData(item, timezone));
    }

    return [forecasts, firstForecast];
}

let formatIndividualForecastData = (forecast, timezone) => {

    let rain = forecast.rain ? forecast.rain["3h"] : 0.00;
    let snow = forecast.snow ? forecast.snow["3h"] : 0.00;

    return {
        date: formatDate(forecast.dt + timezone),
        temp: forecast.main.temp,
        realFeel: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        rain: rain,
        snow: snow,
        main: forecast.weather[0].main,
        weatherIcon: forecast.weather[0].icon
    }    
}

let formatDate = UTCtime => {
    // Set the time adjusted for timezone
    let date = new Date(0);
    date.setUTCSeconds(UTCtime);

    let hour = date.getHours();

    if (hour > 12) {
        hour = `${hour - 12} PM`;
    } else {
        hour = `${hour} AM`;
    }

    return {
        day: `${date.getMonth()}/${date.getDate()}`,
        hour: hour
    }
}


let formatCompleteData = (weatherData, hikingData) => {
    let finalData = {
        forecasts: weatherData.forecasts,
        firstForecast: weatherData.firstForecast,
        lat: weatherData.lat,
        lon: weatherData.lon,
        city: weatherData.city,
        trails: hikingData.trails
    }

    return finalData;
}

const APIcontroller = {
    getWeatherData: city => {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                uri: 'http://api.openweathermap.org/data/2.5/forecast',
                json: true,
                qs: {
                    q: city,
                    appid: "b57e812bce3370986dbc6edd09069420",
                    units: 'imperial'
                }
            }
    
            request(options)
            .then(function (response) {
                let weatherData = formatWeatherAPIresponseData(response);
                console.log(weatherData);
                resolve(weatherData);
            })
            .catch(function (err) {
                console.log(err);
            });
        });
    },

    getHikingData: weatherData => {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                uri: 'https://www.hikingproject.com/data/get-trails',
                json: true,
                qs: {
                    lat: weatherData.lat,
                    lon: weatherData.lon,
                    key: "200681523-e519e6daebc6274de71c2a8771bee583"
                }
            }
    
            request(options)
            .then(function (response) {
                let finalData = formatCompleteData(weatherData, response);
                resolve(finalData);
            })
            .catch(function (err) {
                console.log(err);
            });
        });
    }
}

module.exports = APIcontroller;