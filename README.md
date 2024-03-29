# Koala Bot 2

## Description

This project builds on the knowledge gained from [Koala Bot](https://github.com/D3h4n/Koala-Bot) and
seeks to improve
the software design aspects of the project.

## Goals

- Good Design
  - This project should reflect the good design practices that I've learned since starting Koala
    Bot.
  - It should be easily maintainable and extendable
  - Core logic should be decoupled from 3rd party packages to reduce to impact of rapidly changing
    APIs/Interfaces and improve testability.
  - Logic should be broken up in to distinct and disjoint modules for each specific concern.
- Test Driven Development
  - This project should be driven by good test practices and good tests.
- DevOps
  - This project should employ the DevOps strategies that I've learned, to support the development
    and deployment process.
  - Continuous Integration/Continuous Deployment.
- Focussed
  - Koala Bot 2 should prioritize useful functionality over being flashy and cool (R.I.P. random
    commands that I added for no reason :sob:).

## Planned Commands

### Misc

1. Echo - Repeat a given message
2. Choose - Choose a random option
3. Yeet - Yeet chatters from one voice channel to another

### Music

1. Play - Play a song in a voice channel or add a song to the queue
2. Pause - Pause the song that is currently playing
3. Resume - Resume the song that is currently paused
4. Skip - Skip the song that is currently playing
5. Queue - Display the songs currently in the queue
6. Loop - Loop a song or the queue
7. Stop - Stop playing
8. NowPlaying - Displays info about the song that is currently playing
9. Seek - Specify a timestamp to start playing a song from

## Completed Commands

- [x] Choose
- [x] Echo
- [x] Loop
- [x] NowPlaying
- [x] Pause
- [x] Play
- [x] Queue
- [x] Remove
- [x] Resume
- [x] Seek
- [x] Shuffle
- [x] Skip
- [x] Stop
- [x] Yeet

## TODO

- [x] Create the initial walking skeleton for a basic command
- [x] Figure out an automated way to update slash commands on discord
- [x] Refactor error handling
  - [x] Return the result of an operation instead of throwing an error
  - [x] Handle errors within the command handler instead of widely scoped try-catch
- [x] Shift Interface Definitions in to their own files within a domain sub folder
- [ ] Maybe shift the architecture to be more in line with web servers
  - [ ] Commands are registered to some overarching router based on a path
  - [ ] Dependecies are injected based on needs instead of one object with all dependecies
        (non-music commands shouldn't know about the music adapter)
