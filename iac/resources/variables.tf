
# variable "account" {
#   description = "AWS account"
# }

# variable "lambda_vpc_id" {
#   description = "AWS VPC were to deploy the lambda function"
#   default     = null
# }

# variable "lambda_project_name" {
#   description = "Principal project for lambda function"
# }

# variable "lamdba_description" {
#   description = "Lambda function description"
# }

# variable "lambda_s3_bucket" {
#   description = "S3 bucket were lamdba zip file is stored"
# }

# variable "lambda_s3_key" {
#   description = "Zip filename of lambda function"
# }

# variable "lambda_tracing_mode" {
#   description = "Enables X-Ray tracing"
#   default     = null
# }

# variable "lambda_kms_key_arn" {
#   description = "AWS specific KMS to encrypt environment variables"
#   default     = null
# }

# variable "api_gateway_name" {
#   description = "Name of the API Gateway that needs permissions to call this lambda"
# }

# variable "enable_dynatrace_layer" {
#   description = "Enable Dynatrace layer, when this is enabled, the dynatrace layer is added to the lambda function"
#   type        = bool
#   default     = false
# }

# variable "enable_logs_insights_layer" {
#   description = "Enable AWS Logs Insights layer, when this is enabled, the dynatrace layer is added to the lambda function"
#   type        = bool
#   default     = false
# }

####

variable "lambda_region" {
  description = "Default AWS region"
  default     = "eu-west-2"
}

variable "lambda_name" {
  description = "Lambda function name"
}

variable "lambda_function_handler" {
  description = "Lambda function handler"
}

variable "lambda_function_runtime" {
  description = "Runtime to use with lambda"
}

variable "lambda_source_code_path" {
  description = "Path to lambda generated zip"
}

variable "lambda_memory_size" {
  description = "Lambda function memory size"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Amount of time Lambda function has to run"
  type        = number
  default     = 3
}

variable "lambda_environment_variables" {
  description = "Map of environment variables per environment"
  type        = map(any)
}

variable "lambda_log_group_retention_in_days" {
  description = "Log group retention period"
  type        = number
  default     = 14
}

variable "common_tags" {
  description = "Common Tags to apply"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}

variable "lambda_ci_environment_slug" {
  description = "Specific environment slug"
}
