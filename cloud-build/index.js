const IncomingWebhook = require("@slack/client").IncomingWebhook;
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = (event, callback) => {
  const build = eventToBuild(event.data);
  if (!isValidBuild(build)) return;

  // Skip if the current status is not in the status list.
  // Add additional statues to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ["SUCCESS", "FAILURE", "INTERNAL_ERROR", "TIMEOUT"];
  if (status.indexOf(build.status) === -1) {
    return callback();
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message, callback);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(new Buffer.from(data, "base64").toString());
};

const isValidBuild = (build) => {
  const subs = build.substitutions;
  if (!subs) return false;
  if (!subs.BRANCH_NAME) return false;
  if (!subs.REPO_NAME) return false;
  return true;
};

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  let message = {
    text: `Build \`${build.id}\``,
    mrkdwn: true,
    attachments: [
      {
        title: "Build logs",
        title_link: build.logUrl,
        fields: [
          {
            title: "Status",
            value: build.status,
          },
          {
            title: "Branch",
            value: build.substitutions.BRANCH_NAME,
          },
          {
            title: "Repository",
            value: build.substitutions.REPO_NAME,
          },
        ],
      },
    ],
  };
  return message;
};
