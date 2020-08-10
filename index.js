const { App } = require('@slack/bolt');
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// Initializing app ***

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

app.event('message', ({ event }) => {  
  
  // Set text and ts of slack message to own variables
  const {text, ts} = event;
  
  // Check to see if the message is a reply
  if (event.thread_ts !== undefined) {
    // List all current entries in the table to find match
    base('table').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record) {
          // Run matching of thread timestamp to all timestamps to find parent
          if (event.thread_ts == record.get('ts')) {
            base('table').update([
              {
                "id": record.id,
                "fields": {
                  "thread": text
                }
              }
            ], function(err, records) {
              if (err) {
                console.error(err);
                return;
              }
            });
          }
        });
    });
  }
  // Otherwise, create a new entry
  else {
    base('table').create([
      {
        "fields": {
          ts: ts,
          message: text
        }
      },
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
});


// *** Handle errors ***

app.error((error) => {
	// Check the details of the error to handle cases where you should retry sending a message or stop the app
	console.error(error);
});

// *** Start the app ***

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

