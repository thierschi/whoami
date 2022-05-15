# Whoami
## Introduction
This is a simple webb app for playing who am I (aka. Wer bin ich) online instead of using cards that get glued to your forhead.

It was built using
- nextjs, react and typescript
- material ui
- recoil

## Usage
Should you want to use this app yourself, follow these steps to deploy this app.

> Before running this application make sure NodeJS 16LTS is installed. Download ispt [here](https://nodejs.org/)

1. Clone this repository and navigate into it
2. Run `npm i` to install all dependencies
3. Run `npm run build` to build the application
4. Run `npm start` to run the application

> Important: Make sure that you have port rules for port 80.

### Run server datached
In order to keep the server running after the terminal session is closed I recommend that you use `screen`.
- Make sure that you have built the application as described above.
- Open a new screen session with `screen -S <session name>`
- Inside the screen session run `npm start`
- Close and detach from the screen session by pressing `ctr+a d`
- Resume the session anytime by running `screen -r <session name>`