#!/bin/bash

# Print current directory
echo "Current directory: $(pwd)"

# List files in the current directory
echo "Files in current directory:"
ls

# Display the current date and time
echo "Current date and time: $(date)"

# Copy env
cp ./src/environments/environment.ts ./src/environments/environment.prod.ts

# Replace vars
sed -i 's/apiKey:""/apiKey:"${{ ENV_API_KEY }}"/g' ./src/environments/environment.prod.ts
sed -i 's/fbDbUrl:""/fbDbUrl:"${{ ENV_FB_DB_URL }}"/g' ./src/environments/environment.prod.ts

# List env files
echo "Files in environments directory:"
ls -la ./src/environments/
