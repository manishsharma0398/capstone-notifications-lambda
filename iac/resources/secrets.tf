# iac\resources\secrets.tf

data "aws_secretsmanager_secret" "capstone_email_key" {
  name = var.lambda_environment_variables.CAPSTONE_EMAIL_KEY
}

data "aws_secretsmanager_secret" "capstone_email_pass_key" {
  name = var.lambda_environment_variables.CAPSTONE_EMAIL_PASS_KEY
}
