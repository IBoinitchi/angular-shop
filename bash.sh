#!/bin/bash

echo $ENV_API_KEY
echo $ENV_FB_DB_URL

# Display the current date and time
echo "Current date and time: $(date)"

# Copy env
cp ./src/environments/environment.ts ./src/environments/environment.prod.ts

# Replace vars
sed -i 's/production: false/production: true/g' ./src/environments/environment.prod.ts
# sed -i 's/apiKey: ""/apiKey: "'$ENV_API_KEY'"/g' ./src/environments/environment.prod.ts
sed -i "s@apiKey: \"\"@apiKey: \"$ENV_API_KEY\"@" ./src/environments/environment.prod.ts
# sed -i 's/fbDbUrl: ""/fbDbUrl: "'$ENV_FB_DB_URL'"/g' ./src/environments/environment.prod.ts
sed -i "s@fbDbUrl: \"\"@fbDbUrl: \"$ENV_FB_DB_URL\"@" ./src/environments/environment.prod.ts

# List env files
echo "Files in environments directory:"
ls -la ./src/environments/

cat ./src/environments/environment.prod.ts
