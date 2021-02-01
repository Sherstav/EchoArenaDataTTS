# EchoArenaDataTTS

## Description

EchoArenaDataTTS is a program that runs in the background while you play Echo VR, and when you join a match reads to you where the server is located with text to speech.

#### You can download it [here](https://github.com/Sherstav/EchoArenaDataTTS/releases)

## Requirements

To use this program, you require:

- Echo VR on Rift or Quest
- A PC

## Install Guide

### Rift and Rift S

- Download and extract the latest version of EchoArenaDataTTS into its own folder on your computer
- Run the program by double clicking on the EchoArenaDataTTS.exe file
- Start Echo VR and when you join the lobby, you should hear a text to speech voice saying the location of the lobby you have joined
- Go into the game settings menu in Echo VR and set the option Enable API Access to true

The program should play a sound telling you what server you're on

### Quest and Quest 2

- Download and extract the latest version of EchoArenaDataTTS into its own folder on your computer
- Run the program by double clicking on the EchoArenaDataTTS.exe file and close it after it opens
- The file QuestIP.txt should have been generated. Open it with a text editor like Notepad
- In the file QuestIP.txt, enter the IP of your Quest headset. You can get this IP by following the steps in the section Getting your Quest's IP below
- Start Echo VR and EchoArenaDataTTS by double clicking on the EchoArenaDataTTS.exe file
- Go into the game settings menu in Echo VR and set the option Enable API Access to true

The program should play a sound telling you what server you're on

### Getting your Quest's IP

Note: This has not been tested on and may not work on the Quest 1
If you are able to get the IP of your Quest 1, the rest of the program should still work

- Press the Oculus button
- Click the settings gear at the bottom right of the Oculus menu
- Click on Wifi box to view your Wifi networks
- Click on the network you are currently connected to
- Scroll down and click on Advanced
- Keep scrolling down until you find IP Address. The number below is your Quest's IP Address. It should be 4 numbers seperated by periods. Return to your computer and enter this into the QuestIP.txt file

## Troubleshooting

### Sound not working

- Make sure your computer's output device is set to your headset's speakers or playing out loud if you're on Quest

### Not connecting to headset

- Make sure your computer and Quest are connected to the same network
