# iac\resources\sns.tf

resource "aws_sns_topic_subscription" "lambda_email_sub" {
  topic_arn = data.terraform_remote_state.sns.outputs.topic_arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.main.arn
}

# Allow SNS to invoke Lambda
resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = data.terraform_remote_state.sns.outputs.topic_arn
}
