# EchoArenaDataTTS

## Description

EchoArenaDataTTS is a program that runs in the background while you play Echo VR, and when you join a match reads to you where the server is located with text to speech.

#### You can download it [here](https://github.com/Sherstav/EchoArenaDataTTS/releases)

## Requirements

To use this program, you require:

- Echo VR on PC

This program only works with Echo VR on PC, meaning running on a Rift of Rift S. It should work with Oculus Link on the Quest, although this has not been tested.
- node.js

This program runs on node.js and requires it to work. You can download the latest version [here](https://nodejs.org/en/download/).


## Install Guide

- Download and extract the latest version of EchoArenaDataTTS into its own folder
- Run the program by double clicking on the run.bat file
- A text file called api-key.txt should have been generated. Open the file with a text editor, and paste in an api-key. Instructions on how to get an api-key are in the section below
- Now run the program again, and make sure you get the message `Success checking api-key.`
- Start Echo VR and when you join the lobby, you should hear a text to speech voice saying the location of the lobby you have joined

## Creating a valid api-key

- Create an account with the IP location provider we use [here](https://ipgeolocation.io/signup.html)
- After logging in, go to your dashboard and copy your API key, and paste it into the api-key.txt file.
Make sure that your api key is the only thing in the api-key.txt file. If the api-key.txt file does not
exist, try running the program by double clicking run.bat.

## Troubleshooting

### Sound not working

- Make sure your computer's output device is set to your headset's speakers
