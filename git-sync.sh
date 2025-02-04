#!/bin/bash

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Ensure required environment variables are set
if [[ -z "$GIT_USERNAME" || -z "$GIT_PERSONAL_ACCESS_TOKEN" || -z "$GIT_REPO_URL" ]]; then
  echo "❌ Error: Missing required environment variables (GIT_USERNAME, GIT_PERSONAL_ACCESS_TOKEN, GIT_REPO_URL)"
  exit 1
fi

# Construct Git credentials
GIT_CREDENTIALS="https://${GIT_USERNAME}:${GIT_PERSONAL_ACCESS_TOKEN}@${GIT_REPO_URL#https://}"

# Navigate to the project directory
cd "$(dirname "$0")"

# Check Git status
git status

# Add all changes
git add .

# Commit changes with a timestamp
COMMIT_MESSAGE="Auto-commit: $(date)"
git commit -m "$COMMIT_MESSAGE"

# Push changes to GitHub
git push "$GIT_CREDENTIALS" main

echo "✅ Changes pushed successfully!"

