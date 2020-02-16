const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

let APIcontroller = require('./APIDataController');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
}

app.use(ignoreFavicon);

app.get("/", (req, res) => {

    res.render('index-blank');
});

app.get("/:city", (req, res) => {

    APIcontroller.getWeatherData(req.params.city)
    .then(weatherData => {
        return APIcontroller.getHikingData(weatherData);
    })
    .then(data => {
        // console.log(data);
        res.render('index', 
            {
                forecast: data.forecast,
                trails: data.trails,
                city: data.city
            });
    })
    .catch(function (err) {
        console.log(err);
    });
});

app.listen(port);