# variables.tf

variable "project_id" {
  description = "The ID of the Google Cloud project where resources will be created."
  type        = string
}

variable "public_bucket_name" {
  description = "The globally unique name for the public Cloud Storage bucket."
  type        = string
}

variable "private_bucket_name" {
  description = "The globally unique name for the private Cloud Storage bucket."
  type        = string
}

variable "region" {
  description = "The Google Cloud region for the buckets."
  type        = string
}
