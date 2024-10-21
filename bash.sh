#!/bin/bash

# Display the current date and time
echo "Current date and time: $(date)"

# Copy env
cp ./src/environments/environment.ts ./src/environments/environment.prod.ts

# List env files
echo "Files in environments directory:"
ls -la ./src/environments/

# Replace vars
sed -i 's/production: false/production: true/g' ./src/environments/environment.prod.ts
sed -i "s@apiKey: \"\"@apiKey: \"$ENV_API_KEY\"@" ./src/environments/environment.prod.ts
sed -i "s@firebaseDBUrl: \"\"@firebaseDBUrl: \"$ENV_FB_DB_URL\"@" ./src/environments/environment.prod.ts
