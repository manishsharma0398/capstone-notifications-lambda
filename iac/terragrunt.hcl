# iac/terragrunt.hcl

locals {
  project = "Capstone"
  owner   = "Manish"
  region  = "ap-south-2"

  common_tags = {
    Project = "Capstone"
    Owner   = "Manish"
    Managed = "Terraform"
  }
}

remote_state {
  backend = "s3"
  config = {
    bucket  = "capstone-community-connect-tf-state"
    key     = "lambda/notifications/${path_relative_to_include()}/terraform.tfstate"
    region  = "${local.region}"
    encrypt = true
  }
}

inputs = {
  lambda_name             = "capstone-notifications"
  lambda_function_handler = "dist/src/index.handler"
  lambda_function_runtime = "nodejs22.x"
  lambda_source_code_path = "../lambda.zip"
  # lambda_s3_bucket        = ""
  # lambda_s3_key           = ""
  # lambda_kms_key_arn      = ""
  # lambda_source_code_hash = ""
  # api_gateway_name        = ""
  common_tags = "${local.common_tags}"
}
