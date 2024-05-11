# OldSchoolSDK

- [Click here to try the original Inferno Trainer (which this SDK was based on)](https://www.infernotrainer.com/)
- [Click here to try the 3D Inferno Trainer](https://inferno.colosim.com/)
- [Click here to try the 3D Sol Heredit Trainer](https://colosim.com/)
- [Join our Discord](https://discord.gg/Z3ZyY7Yzt5)

## What is this project?

This project stemmed from my interest in Old School Runescape's Inferno, and my desire for an open source, relatively clean re-implementation of the Old School Runescape engine. The underlying code is designed closer to a true game engine compared to any other trainer or simulator. The goal is for there to be a clean, well-defined API between all "Game Content" code and any underlying "Engine" code

## How do I use it?

This is published at `@supalosa/oldschool-trainer-sdk`. Please see [here](https://github.com/Supalosa/InfernoTrainer) for example implementations. Better instructions will come soon.

## I found a bug!

Likely. Please open a issue above. Videos, screenshots, proof of OSRS science, etc is appreciated. I want this to be a faithful re-implementation of OSRS and all bugs are appreciated.

## Can I contribute?

Sure. Right now the code is undergoing rapid development and the API is not stable. I am open to pull requests but I suggest you start small and let me talk to you first to make sure we're aligned.

## Development notes

### Developing the project from a client project:

Modify `package.json`:

    -  "main": "_bundles/main.js",
    +  "main": "src/sdk/index.js",
    -  "files": []

From this project:

    npm link

From client project

    npm link @supalosa/oldschool-trainer-sdk

When done, revert the changes to `package.json` and `npm unlink @supalosa/oldschool-trainer-sdk`, and re-install `@supalosa/oldschool-trainer-sdk` at the desired SDK version.

### Running tests

    npx jest
