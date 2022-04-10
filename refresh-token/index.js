const IncomingWebhook = require("@slack/client").IncomingWebhook;
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

module.exports.notifyTokenRefresh = (req, res) => {
  const { method, body } = req;

  if (method !== "POST" || req.get("content-type") !== "application/json") {
    res.status(405).send({
      message: null,
      error: "Request is invalid.",
    });
    return;
  }

  const message = createSlackMessage(body);
  webhook
    .send(message)
    .then((resp) => {
      res.status(200).send({
        message: "Token Refresh notification is successfully sent to Slack.",
        error: null,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: null,
        error: err.traceback || err.message || err,
      });
    });
};

const createSlackMessage = ({ status, dpop, searchSessionId }) => {
  let message = {
    text: "Token Refresh",
    mrkdwn: true,
    attachments: [
      {
        fields: [
          {
            title: "Status",
            value: status,
          },
          {
            title: "New Dpop",
            value: dpop,
          },
          {
            title: "New Search Session ID",
            value: searchSessionId,
          },
        ],
      },
    ],
  };
  return message;
};
