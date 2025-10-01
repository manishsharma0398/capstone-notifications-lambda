# iac/stg/terragrunt.hcl

include "root" {
  path = find_in_parent_folders()
}

locals {
  global_vars = read_terragrunt_config(find_in_parent_folders())
  env         = "stg"
}

terraform {
  source = "../resources"
}

inputs = {
  lambda_ci_environment_slug = "${local.env}"
  lambda_memory_size         = 256
  lambda_timeout             = 3
  lambda_environment_variables = {
    LOG_LEVEL = "DEBUG"
  }
  lambda_vpc_id = "vpc-0653c2a227121428d"
  # lambda_tracing_mode                = ""
  lambda_log_group_retention_in_days = 3
  # enable_dynatrace_layer             = ""
  # enable_logs_insights_layer         = ""
  tags               = {}
  lamdba_description = "stg lambda to handle notifications"
}
