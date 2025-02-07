#!/bin/bash

# Build directory
BUILD_DIR="build"

# Ensure the build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Error: Build directory '$BUILD_DIR' not found. Run 'yarn build' first."
    exit 1
fi

# Add your deployment commands here
# For example, if you're using rsync to a server:
# rsync -avz --delete $BUILD_DIR/ user@your-server:/path/to/deployment/

# Or if you're using AWS S3:
# aws s3 sync $BUILD_DIR/ s3://your-bucket-name/

echo "Deployment completed successfully!"
