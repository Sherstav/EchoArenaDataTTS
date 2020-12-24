const axios = require("axios");
const googleTTS = require("google-tts-api"); // here lies the remains of reguire()
const audic = require("audic");
const fs = require("fs");

//sound = new Audic();

let date = new Date();

function GetLogName()
{
    date = new Date();
    return "log-" + (1+date.getMonth()) +"-"+date.getDate()+"-"+date.getFullYear()+".txt";
}
function GetTimeStamp()
{
    date = new Date();
    return "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]";
}

function LogError(str)
{
    console.error(str);
    fs.appendFile("./logs/"+GetLogName(), GetTimeStamp() + " " + str + "\n", ()=>{});
}

function Log(str)
{
    fs.appendFile("./logs/"+GetLogName(), GetTimeStamp() + " " + str + "\n", ()=>{});
}

fs.appendFile("./logs/" + GetLogName(), "Program startup"+"\n" , ()=>{
    Log("Startup");
});

function PrintError(errorWhile, errorText)
{
    LogError("Error while "+errorWhile+": " + errorText);
    LogError("Please report this to a developer on Discord: shersal#2106  Registered#1266");
    LogError("If you can't send a direct message, join the Echo VR Discord server and try again.");
}

let lastMap = "";

if(!fs.existsSync("./api-key.txt"))
{
    LogError("No api-key file found. Generating one. You must enter your API Key into the file for the program to run. Instructions can be found in the installation tutorial");
    fs.appendFile("api-key.txt", " ", (err)=>{
        PrintError("generating api-key file", err);
    });
    process.exit(1);
}
const apiKey = fs.readFileSync("./api-key.txt","utf8");

axios.get("http://api.ipstack.com/1.1.1.1?access_key="+apiKey).then((response)=>{
    let data = response.data;

    if (data.hasOwnProperty("success") && data.success == false)
    {
        if (data.error.code == 101)
        {
            LogError("Invalid api-key! Check the installation instructions to create a valid api key.");
        }
        else if (data.error.code == 104)
        {
            LogError("Usage limit reached for this api key.");
        }
        else
        {
            PrintError("sending api-key check request", data.error.info);
        }
        process.exit(1);
    }
    else
    {
        Log("Success checking api-key.");
        setInterval(Loop, 1000);
    }
}).catch((err)=>{
    PrintError("sending api-key check request", err);
})

function Loop()
{

    Main();
}

function Main()
{
    // send request
    axios.get("http://127.0.0.1:6721/session").then((response)=>{
        //Log(response.data.response);
        if(response.data.map_name != lastMap)
        {
            lastMap = response.data.map_name;
            Log("Just joined");
            ProcessInput(response.data);
        }
    }).catch((err)=>{
        LogError("ERROR: " + err);
    })
}

function ProcessInput(data)
{
    let ip = data.sessionip;
    Log("http://api.ipstack.com/" + ip + "?access_key=" + apiKey);

    axios.get("http://api.ipstack.com/" + ip + "?access_key=" + apiKey).then((response)=>{
        let data = response.data;
        Log(data);
        let location = {continent: data.continent_name, continent_code: data.continent_code, country: data.country_name, country_code: data.country_code, region: data.region_name, city: data.city};
        GenerateOutput(location);
    }).catch((err)=>{
        LogError(err);
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