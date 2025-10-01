# iac/prd/terragrunt.hcl

include "root" {
  path = find_in_parent_folders()
}

locals {
  global_vars = read_terragrunt_config(find_in_parent_folders())
  env         = "prd"
}

terraform {
  source = "../resources"
}

inputs = {
  lambda_ci_environment_slug = "${local.env}"
  lambda_memory_size         = 256
  lambda_timeout             = 3
  lambda_environment_variables = {
    LOG_LEVEL               = "INFO"
    CAPSTONE_EMAIL_KEY      = "CAPSTONE_PRD_EMAIL"
    CAPSTONE_EMAIL_PASS_KEY = "CAPSTONE_PRD_EMAIL_PASS"
  }
  lambda_vpc_id = "vpc-0838bac41ccae0716"
  # lambda_tracing_mode                = ""
  lambda_log_group_retention_in_days = 7
  # enable_dynatrace_layer             = ""
  # enable_logs_insights_layer         = ""
  tags               = {}
  lamdba_description = "prd lambda to handle notifications"
}