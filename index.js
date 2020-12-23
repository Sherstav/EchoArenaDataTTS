const axios = require("axios");
const audic = require("audic");

//sound = new Audic();

function Loop()
{
    // get match data
    let matchData = GetMatchData();

    if (matchData == false)
        return;

    
    // if match is a game, get ip etc
    // ProcessInput();

    // tts
    // sound.play();
}

function GetMatchData()
{
    // send request
    axios.get("http://127.0.0.1:6721/session").then((response)=>{
        console.log(response);
    }).catch((err)=>{
        console.error(err);
        return false;
    })

    // parse json

    //console.clear();
    //console.log(matchData);
    
    // return parsed data
    //return matchData;
}

let interval = setInterval(Loop, 1000);