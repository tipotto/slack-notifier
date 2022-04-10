const IncomingWebhook = require("@slack/client").IncomingWebhook;
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

module.exports.notifyError = (req, res) => {
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
        message: "Error notification is successfully sent to Slack.",
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

const createSlackMessage = ({ type, form, error }) => {
  let message = {
    text: "Error occurred!",
    mrkdwn: true,
    attachments: [
      {
        fields: [
          {
            title: "Type",
            value: type,
          },
          {
            title: "Form",
            value: JSON.stringify(form, null, "\t"),
          },
          {
            title: "Stacktrace",
            value: error,
          },
        ],
      },
    ],
  };
  return message;
};
