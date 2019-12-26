const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

console.log(process.env);

const app = express();

app.listen(3000,() => console.log('listening at 3000'));

app.use(express.static('public'));

app.use(express.json({limit:'1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api',(request,response)=>{
    database.find({},(err,data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api',(request, response) => {
    console.log('I got a request!');
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);

    response.json(data);
});

app.get('/weather/:latlon',async (request, response) =>{
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
    //const api_url = `https://api.darksky.net/forecast/e9f0aafcb3fb246ef52cff59efaa42fc/22.329448499999998,114.1595282`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather : weather_data,
        air_quality: aq_data,
    };
    response.json(data); //proxy server
});

