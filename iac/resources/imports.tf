# iac\resources\imports.tf

data "terraform_remote_state" "vpcs" {
  backend = "s3"
  config = {
    bucket = "capstone-community-connect-tf-state"
    key    = "live/${var.lambda_ci_environment_slug}/networking.tfstate"
    region = "${var.lambda_region}"
  }
}

data "terraform_remote_state" "sns" {
  backend = "s3"
  config = {
    bucket = "capstone-community-connect-tf-state"
    key    = "live/${var.lambda_ci_environment_slug}/sns.tfstate"
    region = "${var.lambda_region}"
  }
}
