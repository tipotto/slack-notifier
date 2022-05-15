SLACK_WEBHOOK_URL='https://hooks.slack.com/services/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'
BUCKET='slack-cloud-build-notification'

# Cloud Functionをデプロイ
gcloud functions deploy $BUCKET \
    --stage-bucket $BUCKET \
    --entry-point subscribe \
    --trigger-topic cloud-builds \
    --runtime nodejs14 \
    --region asia-northeast1 \
    --set-env-vars SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL