SLACK_WEBHOOK_URL='https://hooks.slack.com/services/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'
BUCKET='markets-cloud-build-slack-notifier'

# Cloud Functionをデプロイ
gcloud functions deploy markets-cloud-build-slack-notifier \
    --stage-bucket $BUCKET \
    --entry-point subscribe \
    --trigger-topic cloud-builds \
    --runtime nodejs14 \
    --set-env-vars SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL