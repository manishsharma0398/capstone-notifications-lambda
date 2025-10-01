output "aws_iam_role_arn" {
  description = "ARN of the IAM role"
  value       = aws_iam_role.lambda_exec.arn
}

output "aws_lambda_arn" {
  description = "ARN of the lambda"
  value       = aws_lambda_function.main.arn
}
