# main.tf

# Configure the Google Cloud provider.
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ======================================================================
# SERVICE ACCOUNT
# ======================================================================

resource "google_service_account" "app_service_account" {
  account_id   = "app-file-uploader"
  display_name = "Application Service Account"
}

resource "google_project_iam_member" "service_account_project_access" {
  project = var.project_id
  role    = "roles/storage.objectAdmin" 
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

# ======================================================================
# PRIVATE BUCKET
# This bucket is private by default, and only accessible by the
# application service account.
# ======================================================================

resource "google_storage_bucket" "private_bucket" {
  name          = var.private_bucket_name
  location      = var.region
  force_destroy = false
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_iam_member" "service_account_access_private" {
  bucket = google_storage_bucket.private_bucket.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.app_service_account.email}"
}

# ======================================================================
# PUBLIC BUCKET
# This bucket is explicitly public and is configured for Cloud CDN.
# ======================================================================

resource "google_storage_bucket" "public_bucket" {
  name          = var.public_bucket_name
  location      = var.region
  force_destroy = false
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.public_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloud CDN configuration for the public bucket
resource "google_compute_backend_bucket" "cdn_backend" {
  name        = "${var.public_bucket_name}-cdn-backend"
  bucket_name = google_storage_bucket.public_bucket.name
  enable_cdn  = true
}
