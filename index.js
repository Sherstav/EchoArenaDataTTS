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

function GetAPIURL(ip)
{
    return "http://ip-api.com/json/"+ip;
}

function PrintError(errorWhile, errorText)
{
    LogError("Error while " + errorWhile + ": " + errorText);
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
    if (parseData.prelease)
    {
        Log("WARNING: This build is a prerelease, and issues may occur. If you do find any,");
        Log("please report them to a developer on Discord: shersal#2106  Registered#1266");
        Log("If you can't send a direct message, join the Echo VR Discord server and try again.");
    }
}).catch((err)=>{
    PrintError("sending version check request", err);
});

//Log(GetAPIURL(apiKey, "1.1.1.1"));
axios.get(GetAPIURL("1.1.1.1")).then((response)=>{
    let data = response.data;
    

    if (data.hasOwnProperty("message"))
    {
        LogError("Error while checking api-key: " + data.message);
        process.exit(1);
    }
    else
    {
        Log("Success checking api");
        setInterval(Loop, 1000);
    }
}).catch((err)=>{
    if (err.response.status == "fail")
    {
        LogError("Error while sending api-key check request");
        LogError("Make sure that your api key is in the api-key.txt file with nothing else in the file.")
        LogError("If the issue persists, report this to a developer on Discord: shersal#2106  Registered#1266");
        LogError("If you can't send a direct message, join the Echo VR Discord server and try again.");
    }
    else
    {
        PrintError("sending api-key check request", err);
    }
});

function Loop()
{
    Main();
}

let conErrorCount = 0;
let contactMessage = false;

let headset = "127.0.0.1";

// check if there is an override ip

if (fs.existsSync("QuestIP.txt"))
{
    Log("Found QuestIP.txt.");
    // read it
    let a = fs.readFileSync("QuestIP.txt", "utf8");
    a ? headset = a : null;
}
else
{
    // make it
    Log("QuestIP.txt doesn't exist, making it.");
    fs.appendFile("QuestIP.txt", "", ()=>{});
}

Log("Connecting with IP " + headset);

function Main()
{
    // send request
    axios.get("http://" + headset + ":6721/session").then((response)=>{
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
    Log(GetAPIURL(ip));

    axios.get(GetAPIURL(ip)).then((response)=>{
        let data = response.data;
        Log(data);
        let location = {continent: data.continentName, continent_code: data.continentCode, country: data.country, country_code: data.countryCode, region: data.regionName, city: data.city, isp: data.isp};
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