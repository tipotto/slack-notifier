SLACK_WEBHOOK_URL='https://hooks.slack.com/services/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'
BUCKET='markets-refresh-token-slack-notifier'

# Cloud Functionをデプロイ
gcloud functions deploy $BUCKET \
    --stage-bucket $BUCKET \
    --entry-point notifyTokenRefresh \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL