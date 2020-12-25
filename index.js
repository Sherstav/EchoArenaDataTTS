const axios = require("axios");
const googleTTS = require("google-tts-api"); // here lies the remains of reguire()
const audic = require("audic");
const fs = require("fs");
const version = fs.readFileSync("version.json", "utf8");

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
    console.log(str);
    fs.appendFile("./logs/"+GetLogName(), GetTimeStamp() + " " + str + "\n", ()=>{});
}

function LogOnly(str)
{
    fs.appendFile("./logs/"+GetLogName(), GetTimeStamp() + " " + str + "\n", ()=>{});
}

if (!fs.existsSync("./logs"))
{
    fs.mkdirSync("./logs")
}

Log("Startup");

function GetAPIURL(key, ip)
{
    return "https://api.ipgeolocation.io/ipgeo?apiKey="+key+"&ip="+ip;
}

function PrintError(errorWhile, errorText)
{
    LogError("Error while "+errorWhile +": " + errorText);
    LogError("Please report this to a developer on Discord: shersal#2106  Registered#1266");
    LogError("If you can't send a direct message, join the Echo VR Discord server and try again.");
}

let lastMap = "";

axios.get("https://status.chaugh.com/EchoArenaDataTTS/latest-version.json").then((response)=>{
    let data = response.data;    
    let parseData = JSON.parse(version);
    if(!(data.major == parseData.major && data.minor == parseData.minor && data.patch == parseData.patch))
    {
        LogError("Version out of date, your version is: " + parseData.major + "." + parseData.minor + "." + parseData.patch + ". Current version is: " + data.major + "." + data.minor + "." + data.patch + ". You can download the latest version on our github.");
    }
    else 
    {
        Log("Up to date.");
    }
}).catch((err)=>{
    PrintError("sending version check request", err);
});

if(!fs.existsSync("./api-key.txt"))
{
    LogError("No api-key file found. Generating one. You must enter your API Key into the file for the program to run. Instructions can be found in the installation tutorial");
    fs.appendFile("api-key.txt", " ", (err)=>{
        PrintError("generating api-key file", err);
    });
    process.exit(1);
}
const apiKey = fs.readFileSync("./api-key.txt","utf8");

axios.get(GetAPIURL(apiKey, "1.1.1.1")).then((response)=>{
    let data = response.data;
    // Log(GetAPIURL(apiKey, "1.1.1.1"));

    if (data.hasOwnProperty("message"))
    {
        LogError("Error while checking api-key: " + data.message);
        process.exit(1);
    }
    else
    {
        Log("Success checking api-key.");
        setInterval(Loop, 1000);
    }
}).catch((err)=>{
    PrintError("sending api-key check request", err);
});

function Loop()
{

    Main();
}

let conErrorCount = 0;
let contactMessage = false;

function Main()
{
    // send request
    axios.get("http://127.0.0.1:6721/session").then((response)=>{
        //Log(response.data.response);
        if(response.data.map_name != lastMap)
        {
            lastMap = response.data.map_name;
            Log("Just joined");
            conErrorCount = 0;
            ProcessInput(response.data);
        }
    }).catch((err)=>{
        if (err.code = "ECONNREFUFSED")
        {
            if (conErrorCount < 3)
            {
                LogError("Connection refused.");
                conErrorCount++;
            }
            if (conErrorCount == 3 && contactMessage == false)
            {
                LogError("Make sure Echo VR is open. If this issue persists, contact a developer.");
                contactMessage = true;
            }
            if (conErrorCount == 3)
            {
                LogOnly("Connection refused.");
            }
        }
        else
        {
            LogError("API connection error: " + err);
        }
    })
}

function ProcessInput(data)
{
    let ip = data.sessionip;
    Log(GetAPIURL(apiKey, ip));

    axios.get(GetAPIURL(apiKey, ip)).then((response)=>{
        let data = response.data;
        Log(data);
        let location = {continent: data.continent_name, continent_code: data.continent_code, country: data.country_name, country_code: data.country_code2, region: data.state_prov, city: data.city, isp: data.isp};
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

    const url = googleTTS.getAudioUrl("The server location is " + location.city + ", " + location.region + ", in " + location.country + ", under " + location.isp, {
        lang: "en-US",
        slow: false,
        host: "https://translate.google.com"
    });

    new audic(url).play();
}