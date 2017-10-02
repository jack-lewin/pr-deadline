# PR Deadline

Adds a 'late' label to PRs which haven't been made before the end of the sprint.


## Setup

1. **Clone this repo**

    `git clone https://github.com/jack-lewin/pr-deadline`

    `cd pr-deadline`

2. **Create a new Heroku app and deploy the application**

    For instructions on doing this, see '[Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)'.

3. **Create a GitHub app**

    On your GitHub account settings, go to 'Developer settings' -> 'OAuth Apps'.

    Click 'Register a new application' and enter relevant details.
    
    The authorization callback URL is `https://YOUR-HEROKU-APP-NAME-HERE.herokuapp.com/auth`.

4. **Define the following Heroku config variables:**

    `OWNER` - the owner of the repo.

    `REPO` - to name of the repo.

    `CLIENT_ID` - as per the GitHub app you created in step 3.

    `CLIENT_SECRET` - as per the GitHub app you created in step 3.

    `SPRINT_END_DAY` - the number of the last day of the sprint (e.g. Monday is 1) - defaults to 5 (Friday).

    `SPRINT_END_HOUR` - the hour PR deadline (e.g. 7pm is 19) - defaults to 12 (midday).

5. **Generate an access token**

    Get an access token for the app, by going to `https://YOUR-HEROKU-APP-NAME-HERE.herokuapp.com`.
    
    You'll be redirected to GitHub, where you can authorize the app to use your GitHub profile.

    You'll return to the app, and receive an access token: save this as your `ACCESS_TOKEN` config variable.

6. **Set up a webhook for the repo**

    On the GitHub repo settings, go to 'Webhooks' and click 'Add webhook'.

    Enter your Heroku app URL, and set the content-type to be `application/json`.

    Click 'let me select individual events', and select 'pull request'.
