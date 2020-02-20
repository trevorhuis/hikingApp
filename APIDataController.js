const request = require('request-promise');

let formatWeatherAPIresponseData = json => {
    let weatherData = {
        forecast: {
            temp: json.main.temp,
            temp_min: json.main.temp_min,
            temp_max: json.main.temp_max,
            humidity: json.main.humidity,
            description: json.weather[0].main,
            weatherIcon: json.weather[0].icon,
            wind: json.wind.speed
        },
        lat: json.coord.lat,
        lon: json.coord.lon,
        city: json.name
    }

    return weatherData;
}


let formatCompleteData = (weatherData, hikingData) => {
    let finalData = {
        forecast: weatherData.forecast,
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
                uri: 'http://api.openweathermap.org/data/2.5/weather',
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
                resolve(weatherData);
            })
            .catch(function (err) {
                reject({
                    error: 404,
                    reason: "City not found"
                })
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