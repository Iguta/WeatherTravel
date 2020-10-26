const functions = require('firebase-functions');
const express = require('express');
// const bodyParser = require('body-parser');
global.fetch = require('node-fetch');

const ejs = require('ejs');


const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('/public'));
app.use(express.static('./'));
app.use(express.static('/public/icons_manifest'));

app.get('/', async(req, res) => {
    //res.set('Cache-Control', 'public max-age=300, s-maxage=600');
    const units = 'metric';
    const latNewYork = 40.7128;
    const longNewYork = -74.0060;
    let place = 'New York';
    const rGeocodeUrl = `http://api.positionstack.com/v1/reverse?access_key=f8ed520e1d4cedd903e3f0357540bd83&query=${latNewYork},${longNewYork}`;
    const data = await fetch(rGeocodeUrl);
    const dataJson = await data.json();
    console.log(dataJson);
    if(dataJson.data.length>0){
        place = dataJson.data[0].region;
    };
    console.log(`This place:${place}`);
    const apiKey = 'b612d5c162a1377e256ae60705da4a81';
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latNewYork}&lon=${longNewYork}&exclude=minutely&appid=${apiKey}&units=${units}`;   
    fetch(url)
    .then( data => data.json())
    .then(data => {
        res.render('index', {dataObj:data, place:place});
    })
    .catch( (err) => {
        console.log(err);
    });
});
app.post('/post-search', async (req, res) =>{
    const arr = req.body.searchPlace.split(" ");
    const lat = arr[0];
    const long = arr[1];
    const units = 'metric';
    const apiKey = 'b612d5c162a1377e256ae60705da4a81';

    let place = 'New York';
    const rGeocodeUrl = `http://api.positionstack.com/v1/reverse?access_key=f8ed520e1d4cedd903e3f0357540bd83&query=${lat},${long}`;
    const data = await fetch(rGeocodeUrl);
    const dataJson = await data.json();
    if(dataJson.data.length>0){
        place = dataJson.data[0].region;
    };
    console.log(dataJson);
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=${apiKey}&units=${units}`;   
    fetch(url)
    .then( data => data.json())
    .then(data => {
        res.render('index', {dataObj:data, place:place});
    })
    .catch( (err) => {
        console.log(err);
    });
});

exports.app = functions.https.onRequest(app);
