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

  # description                    = var.lamdba_description
  # s3_bucket                      = var.lambda_s3_bucket
  # s3_key                         = var.lambda_s3_key
  # kms_key_arn                    = var.lambda_kms_key_arn
  # reserved_concurrent_executions = var.lambda_reserved_concurrent_executions
  # layers                         = local.layers

  # dynamic "vpc_config" {
  #   for_each = try(data.aws_subnets.main[0].ids, null) != null && try(aws_security_group.main[0].id, null) != null ? [true] : []
  #   content {
  #     security_group_ids = [aws_security_group.main[0].id]
  #     subnet_ids         = data.aws_subnets.main[0].ids
  #   }
  # }

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

  # depends_on = [
  #   aws_cloudwatch_log_group.main
  # ]
}

resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/lambda/${local.full_lambda_name}"
  retention_in_days = var.lambda_log_group_retention_in_days

  # kms_key_id = var.lambda_log_group_kms_key_id

  tags = merge(var.tags, {
    Name = "${local.full_lambda_name}-logs"
  })
}
