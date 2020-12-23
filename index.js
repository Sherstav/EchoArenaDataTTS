const axios = require("axios");
const audic = require("audic");

sound = new Audic();

function Loop()
{
    // get match data
    let matchData = GetMatchData();

    if (matchData == false)
        return;

    
    // if match is a game, get ip etc
    ProcessInput();

    // tts
    sound.play();
}

function GetMatchData()
{
    // send request
    let data;
    axios.get("http://127.0.0.1:6721/session").then((response)=>{
        
        data = response.data;
    
    }).catch((err)=>{
        console.error(err);
        return false;
    })

    // parse json
    data = JSON.parse(data);
    
    // return parsed data
    return data;
}

let interval = setInterval(Loop, 10);