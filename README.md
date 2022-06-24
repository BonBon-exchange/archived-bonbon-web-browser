[![Github All Releases](https://img.shields.io/github/downloads/danielfebrero/bonbon-web-browser/total.svg)]()

# BonBon Web Browser

Claim back your data ownership.

Built with Electron, React, TypeScript, Redux. The browser is faster than it sounds, it's worth to try it.

We don't collect any personal data or browsing history. We do send some events to Nucleus.sh in order to understand how users are using BonBon Browser. Those events are no more than "open_app", "add_browser", "switch_board"... and will be removed when I will be more confident that the UX is good.

Instead, the browsing history is locally stored and encrypted.

## Try BonBon today

Download BonBon for Windows: [BonBon Browser 0.18.0 for Windows](https://github.com/danielfebrero/bonbon-web-browser/releases/download/0.18.0/BonBon.Setup.0.18.0.exe)

### Notes for Windows

The application is not signed (there is no company yet behind it), and has been avaialble since June 10th, 2022. That's why Windows consider the app as dangerous.

### Notes for Linux

While it has not been tested on Linux, it should work. Please refer to how to run locally or to make a release further in this Readme.

### Notes for macOS

It seems the application is not working correctly yet on mac. In best scenarios, you will have a white screen with a top bar. Fix in progress.

## Features

Completed:

- boards: create a composition of webviews, save it, reuse it, present it

- encrypted browsing history

- darkmode

- chrome extension support (for advanced users)

- uBlockOrigin by default

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

```
npm start
```

To make a release:

```
npm run package
```

Then find the release in bonbon-web-browser/release/build

## Screenshots

![Desktop](https://media.giphy.com/media/gbSdr8VkxappmBCoJq/giphy.gif)

![Desktop](https://github.com/danielfebrero/bonbon-web-browser/blob/master/images/desktop3.PNG)

![Desktop2](https://github.com/danielfebrero/bonbon-web-browser/blob/master/images/desktop4.PNG)
