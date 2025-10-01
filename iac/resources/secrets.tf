
resource "aws_secretsmanager_secret" "capstone_email_key" {
  name = var.lambda_environment_variables.CAPSTONE_EMAIL_KEY
}

resource "aws_secretsmanager_secret" "capstone_email_key_pass" {
  name = var.lambda_environment_variables.CAPSTONE_EMAIL_PASS_KEY
}
