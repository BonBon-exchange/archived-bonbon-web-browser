![Github All Releases](https://img.shields.io/github/downloads/danielfebrero/bonbon-web-browser/total.svg)
![Visits Badge](https://badges.pufler.dev/visits/danielfebrero/bonbon-web-browser)

# BonBon Web Browser

Claim back your data ownership.

Built with Electron, React, TypeScript, Redux. The browser is faster than it sounds, it's worth to try it.

We don't collect any personal data or browsing history. We do send some events to Nucleus.sh in order to understand how users are using BonBon Browser. Those events are no more than "open_app", "add_browser", "switch_board"... and will be removed when I will be more confident that the UX is good.

Instead, the browsing history is locally stored and encrypted.

To stay up to date with the project, submit bugs, and submit features, please join:

- Discord server: [https://discord.gg/hrpp8G9Fqs](https://discord.gg/hrpp8G9Fqs)

- Subreddit: [https://www.reddit.com/r/bonbonbrowser](https://www.reddit.com/r/bonbonbrowser)

- Telegram channel: [https://t.me/bonbonbrowser](https://t.me/bonbonbrowser)

- Telegram chat: [https://t.me/bonbonbrowserchat](https://t.me/bonbonbrowserchat)

## Try BonBon today

Download BonBon for Windows: [BonBon Browser 0.19.0 for Windows](https://github.com/danielfebrero/bonbon-web-browser/releases/download/v0.19.0-rc1/BonBon.Setup.0.19.0.exe)

Download BonBon for macOS arm64: [BonBon Browser 0.19.0 for macOS](https://github.com/danielfebrero/bonbon-web-browser/releases/download/v0.19.0-rc1/BonBon-0.19.0-arm64.dmg)

Download BonBon for macOS: [BonBon Browser 0.19.0 for macOS](https://github.com/danielfebrero/bonbon-web-browser/releases/download/v0.19.0-rc1/BonBon-0.19.0.dmg)

Download BonBon for Linux: [BonBon Browser 0.19.0 for Linux (AppImage)](https://github.com/danielfebrero/bonbon-web-browser/releases/download/v0.19.0-rc1/BonBon-0.19.0.AppImage)

### Notes for Windows

The application is not signed (there is no company yet behind it), and has been avaialble since June 10th, 2022. That's why Windows consider the app as dangerous.

### Notes for Linux

The app was not working before June 25th, 2022. I am sorry for the ones that tried to run it.

### Notes for macOS

The app was not working before June 24th, 2022. I am sorry for the ones that tried to run it.

## Features

Completed:

- boards: create a composition of webviews, save it, reuse it, present it

- encrypted browsing history

- darkmode

- chrome extension support (for advanced users)

- uBlockOrigin by default

- keyboard shortcuts: ctrl (+ shift) +t, +r, +w | alt + scroll

In progress:

- incognito mode

- optionally separate sessions per tabs (per board), useful for being connected to different accounts (many reddit, many facebook...) at the same time

- personalize your search engine and homepage

- permission handler

- insecure web handler

- notifications

- whatsapp, messenger and telegram integration

- install extensions from Chrome store

- support extensions actions (new tab, window, popup...)

- auto update

- app signing

- edge snap

- tiling options

- auto grid

- minimap

### How to manually install a Chrome Extension (v0.16.0 and later)

1. On your regular Chromium based browser, add an extension to download CRX extensions

2. Download and unzip the extensions you want to add to BonBon

3. On Windows, copy the extensions folders to C:\Users\USERNAME\AppData\Roaming\BonBon\extensions (create extensions folder if it does not exists)

4. Reload BonBon

## Run locally or make a release

```bash
git clone https://github.com/danielfebrero/bonbon-web-browser.git
cd bonbon-web-browser
npm install
```

To run it in dev mode:

```bash
npm start
```

To make a release:

```bash
npm run package
```

Then find the release in bonbon-web-browser/release/build

## Team

- Dani ([@danielfebrero](https://github.com/danielfebrero))
- Antho
- Braian ([@braiandickson](https://github.com/braiandickson))
- 0xCUBE ([@0xCUB3](https://github.com/0xCUB3))
- Alberto
- Nuklusone
- Aitor ([@dragonDScript](https://github.com/dragonDScript))

## Videos

![Desktop](https://media.giphy.com/media/gbSdr8VkxappmBCoJq/giphy.gif)

[https://www.youtube.com/watch?v=QqT-lGfy9Vk](https://www.youtube.com/watch?v=QqT-lGfy9Vk)
