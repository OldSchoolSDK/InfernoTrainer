# Inferno Trainer

- [Click here to try the Inferno Trainer](https://www.infernotrainer.com/)
- [Click here to beta test the Inferno Trainer](https://beta.infernotrainer.com/)
- [Join our Discord](https://discord.gg/Z3ZyY7Yzt5)

## What is this project?

This project stemmed from my interest in Old School Runescape's Inferno, and my desire for an open source, relatively clean re-implementation of the Old School Runescape engine. The underlying code is designed closer to a true game engine compared to any other trainer or simulator. The goal is for there to be a clean, well-defined API between all "Game Content" code and any underlying "Engine" code

## How do I use it?

### Pick your own waves

If you want to practice a wave, click one of the links above. You can type in a wave and it will produce a random spawn, and you can re-play the exact spawn if you wish.

### Practice a wave I failed in-game

Alternatively, if you are practicing the Inferno and have the Inferno Stats plugin (Available on RuneLite's Plugin Hub), you can click a wave in the panel and it will load the simulation with the exact spawn. I would recommend you disable the "Hide when outside of the Inferno" feature for when you plank.

## I found a bug!

Likely. Please open a issue above. Videos, screenshots, proof of OSRS science, etc is appreciated. I want this to be a faithful re-implementation of OSRS and all bugs are appreciated.

## Can I contribute?

Sure. Right now the code is undergoing rapid development and the API is not stable. I am open to pull requests but I suggest you start small and let me talk to you first to make sure we're aligned.

## Development notes

Use Node 16 for now. There's an SSL error on version >= 18.

    npm run start

Running test

    npx jest
