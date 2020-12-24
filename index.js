const axios = require("axios");
const googleTTS = require("google-tts-api"); // here lies the remains of reguire()
const audic = require("audic");
const config = require("./api-key.json");

//sound = new Audic();

let lastMap = "";

function Loop()
{
    Main();
}

function Main()
{
    // send request
    axios.get("http://127.0.0.1:6721/session").then((response)=>{
        //console.log(response.data.response);
        if(response.data.map_name != lastMap)
        {
            lastMap = response.data.map_name;
            console.log("Just joined");
            ProcessInput(response.data);
        }
    }).catch((err)=>{
        console.error("ERROR: " + err);
    })
}

function ProcessInput(data)
{
    let ip = data.sessionip;
    console.log("http://api.ipstack.com/" + ip + "?access_key=90ce56843efd551c3298e412c8f9d1d8");

    axios.get("http://api.ipstack.com/" + ip + "?access_key=90ce56843efd551c3298e412c8f9d1d8").then((response)=>{
        let data = response.data; 
        console.log(data);
        let location = {continent: data.continent_name, continent_code: data.continent_code, country: data.country_name, country_code: data.country_code, region: data.region_name, city: data.city};
        GenerateOutput(location);
    }).catch((err)=>{
        console.error(err);
    });
    
    return ip;
}

function GenerateOutput(location)
{
    // the server location is france in EU
    // the server location is Calfifornia in US

    const url = googleTTS.getAudioUrl("The server location is " + location.city + ", " + location.region + ", in " + location.country, {
        lang: "en-US",
        slow: false,
        host: "https://translate.google.com"
    });

    new audic(url).play();
}

let interval = setInterval(Loop, 1000);