# Slack2Airtable

This is an app that installs a bot to your Slack workspace that will archive all messages sent to an Airtable table. This keeps threaded integrity.

## Setup

### Create a Slack app

First of all, you need to set up your app on Slack.
If you don't have a Slack workspace where you can freely install apps, [create one](https://slack.com/create).

Then, go to Slack App Management to create an app by clicking the button:

<a href="https://api.slack.com/apps?new_app=1&ref=glitch_starter_kit" target="_blank"><img alt="create app" style="width:160px" src="https://cdn.glitch.com/c4ac9a31-af24-4489-a9b5-b3fc8f612115%2Fslack_create_button.png?v=1580425013074"></a>

In a popup, give a name ("Hello Bot") then choose the workspace the bot to be installed. Then click **Create App**:

### Add scopes

Next, go to Features > **OAuth & Permissions** scroll down to **Scopes** to specify the **Bot Token Scopes**:
  1. Add `channels:history`. The scope allows your bot to read messages on Slack

To learn more about the bot permission scopes, read [Scopes and permissions docs](https://api.slack.com/scopes)


### Install app & Get your credentials

Now go ahead and install the app once at Settings > **Install App** from the left side navigation, and install the app to your slack workspace.

Once installed, you will need two credentials to be set as environmentasl variables in the **.env** in the glitch project:

1. Bot token (that begins with `xoxb-`, which becomes available after installing your app
2. Go back to **Basic information** and get your _Sigining secret_


### Enable events

Go to Features > **Event Subscriptions** and enable events and enter your _Request URL_, which should be:
  - Your app server URL (On Glitch, it looks something like, `https://my-stuff.glitch.me/`) and append `/slack/events`
   
Then, add event subscriptions under the **Subscribe to Bot Events**:
  - Add `message.channels`. Then Save
  
### Setup Airtable

Create a new table in [Airtable](https://airtable.com/). Name it whatever you like.

Set the column titles to the following settings:
- Primary (1st) Column
  - Name: "ts"
  - Type: Single line text
- 2nd Column
  - Name: "message"
  - Type: Long Text
- 3rd Column
  - Name: "thread"
  - Type: Long text
  
### Add Airtable API

Visit [Airtable's API Page](https://airtable.com/api), and select the table you created.

Near the top of the documentation, you should see `The ID of this base is <string_id>.`. Copy the `string_id` value, and paste it into `AIRTABLE_BASE_ID` in the **.env** file.

Additionally, generate an API key at https://airtable.com/account and paste it into `AIRTABLE_API_KEY` in **.env**.
  
### Try the bot

1. Invite the Bot User into a channel (e.g. `/invite @hello_bot`)
2. Post a message in the channel, it should now create a new entry in Airtable.
3. Post a reply to that message. It should now popular the "thread" entry.

## Known issues/Expansion ideas

This app was first made for Google Sheets. As Google Sheets API is a pain to set up and use, and I wanted to use something different, I decided to use Airtable instead.

This is also rebuilt using Bolt instead of web apis. That's cool.

As a drawback, extra columns are not dynamically created in Airtable as they are in Sheets, making the thread size something you need to customize.

You could also probably mess with the column order and stuff to hide the ts column, which is pretty ugly.

We are also limited by Airtable's API, so this is best used in smaller, slower Slack channels. But if you are running a large one you should probably pay for retention anyway.

Also, you could make a new table for each channel to help organize.

## Code walk-thru

### .env

This is a file for storing secure info:

- `SLACK_ACCESS_TOKEN` : Your bot token (`xoxb-`)
- `SLACK_SIGNING_SECRET`: Your app's _Signing Secret_
- `AIRTABLE_API_KEY`: Airtable's api key
- `AIRTABLE_BASE_ID`: The base id of your Airtable project
  
### package.json

This is a file that contains info about your project. The app requires `@slack/bolt` and `airtable` as its dependencies.

### index.js

Where the code lies. I put comments to help guide you through why things are there.

The code is written with Bolt framework, which makes it super easy to build Slack apps.


## Troubleshooting

If your bot fails, check:
- if your bot token and signing signature is correct in .env
- if the Request URL is correct, also the path, `/slack/events` is appended correctly