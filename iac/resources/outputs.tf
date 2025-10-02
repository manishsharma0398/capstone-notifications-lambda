# iac\resources\outputs.tf

output "aws_iam_role_arn" {
  description = "ARN of the IAM role"
  value       = aws_iam_role.lambda_exec.arn
}

output "aws_lambda_arn" {
  description = "ARN of the lambda"
  value       = aws_lambda_function.main.arn
}

output "lambda_sg_id" {
  description = "ID of the Lambda Security Group"
  value       = aws_security_group.main.id
}

output "lambda_sg_arn" {
  description = "ARN of the Lambda Security Group"
  value       = aws_security_group.main.arn
}

output "lambda_sg_name" {
  description = "Name of the Lambda Security Group"
  value       = aws_security_group.main.name
}
