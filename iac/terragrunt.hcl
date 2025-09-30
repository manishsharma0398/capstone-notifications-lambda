# iac/terragrunt.hcl

locals {
  project     = "Capstone"
  owner       = "Manish"
  region      = "ap-south-2"
  lambda-name = "capstone-notifications"

  common_tags = {
    Project = "Capstone"
    Owner   = "Manish"
    Managed = "Terraform"
  }
}

# Generate a backend config for every child
generate "backend" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  backend "s3" {
    bucket  = "capstone-community-connect-tf-state"
    key     = "lambda/${local.lambda-name}/${path_relative_to_include()}.tfstate"
    region  = "${local.region}"
    encrypt = true
  }
}
EOF
}

# Generate provider + versions (shared everywhere)
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = "~> 1.13.3"
}

provider "aws" {
  region = "${local.region}"
}
EOF
}

inputs = {
  lambda_name             = "${local.lambda-name}"
  lambda_function_handler = "dist/src/index.handler"
  lambda_function_runtime = "nodejs22.x"
  lambda_source_code_path = "${get_parent_terragrunt_dir()}/dist/function.zip"
  # lambda_s3_bucket        = ""
  # lambda_s3_key           = ""
  # lambda_kms_key_arn      = ""
  # lambda_source_code_hash = ""
  # api_gateway_name        = ""
  common_tags = "${local.common_tags}"
}
