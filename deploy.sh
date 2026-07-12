#!/bin/bash
# Exit on error
set -e

echo "=== Local Build Check ==="
npm run build

echo "=== Staging Changes for Git ==="
git add .

# Default commit message if none is provided
COMMIT_MSG=${1:-"Overhaul: Migrate portfolio to modern modular React, Tailwind CSS, and GSAP"}

echo "=== Committing Changes ==="
# Check if there are differences before committing to prevent empty commit errors
if ! git diff-index --quiet HEAD; then
  git commit -m "$COMMIT_MSG"
else
  echo "No changes to commit."
fi

echo "=== Pushing to GitHub main ==="
git push origin main

echo "=== Done! ==="
echo "Successfully pushed to GitHub. GitHub Actions will now automatically build and deploy to GitHub Pages."