SLACK_WEBHOOK_URL='https://hooks.slack.com/services/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'
BUCKET='markets-error-slack-notifier'

# Cloud Functionをデプロイ
gcloud functions deploy $BUCKET \
    --stage-bucket $BUCKET \
    --entry-point notifyError \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL