# iac/resources/main.tf

locals {
  full_lambda_name = "${var.lambda_ci_environment_slug}-${var.lambda_name}-${var.lambda_region}"
  # layers           = []
}

resource "aws_lambda_function" "main" {
  function_name = local.full_lambda_name
  role          = aws_iam_role.lambda_exec.arn

  handler = var.lambda_function_handler
  runtime = var.lambda_function_runtime

  filename         = var.lambda_source_code_path
  source_code_hash = filebase64sha256(var.lambda_source_code_path)

  memory_size = var.lambda_memory_size
  timeout     = var.lambda_timeout

  environment {
    variables = var.lambda_environment_variables
  }

  tags = merge(
    var.common_tags,
    var.tags,
    { Name = local.full_lambda_name
    Environment = var.lambda_ci_environment_slug }
  )

  description = var.lamdba_description
  # s3_bucket                      = var.lambda_s3_bucket
  # s3_key                         = var.lambda_s3_key
  # kms_key_arn                    = var.lambda_kms_key_arn
  # reserved_concurrent_executions = var.lambda_reserved_concurrent_executions
  # layers                         = local.layers

  vpc_config {
    subnet_ids         = data.aws_subnets.main.ids
    security_group_ids = [aws_security_group.main.id]
  }

  # dynamic "tracing_config" {
  #   for_each = var.lambda_tracing_mode == null ? [] : [true]
  #   content {
  #     mode = var.lambda_tracing_mode
  #   }
  # }

  # dynamic "dead_letter_config" {
  #   for_each = var.lambda_dead_letter_target_arn == null ? [] : [true]
  #   content {
  #     target_arn = var.lambda_dead_letter_target_arn
  #   }
  # }

  depends_on = [
    aws_cloudwatch_log_group.main
  ]
}


# -------------------------------
# VPC and Subnet lookups
# -------------------------------

data "aws_vpc" "main" {
  id = var.lambda_vpc_id
}

data "aws_subnets" "main" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }

  tags = {
    Subnet = "Private"
  }
}

# -------------------------------
# Security group for Lambda
# -------------------------------

resource "aws_security_group" "main" {
  name        = "${local.full_lambda_name}-sg"
  description = "Security Group for lamdba function ${local.full_lambda_name}"
  vpc_id      = data.aws_vpc.main.id

  egress {
    description = "Egress Traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, { Name = "${local.full_lambda_name}-sg", Environment : var.lambda_ci_environment_slug })

  lifecycle {
    create_before_destroy = true
  }
}


# -------------------------------
# Cloudwatch log group for Lambda
# -------------------------------

resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/lambda/${local.full_lambda_name}"
  retention_in_days = var.lambda_log_group_retention_in_days

  # kms_key_id = var.lambda_log_group_kms_key_id

  tags = merge(var.tags, {
    Name = "${local.full_lambda_name}-logs"
  })
}
