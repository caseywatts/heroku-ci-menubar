# heroku-ci-menubar

Install electron executable:

`npm install -g electron-prebuilt`

Install dependencies

`npm install`

Get a bearer token from Dashboard (for now), and put it in dotfiles / env variable

`export AUTHORIZATION_BEARER_TOKEN_FOR_HEROKU_CI="1234567890"`

Run the app:

`electron .`
