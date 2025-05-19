# Discord Bot with Admin Dashboard

A Discord bot that allows server administrators to send direct messages to all users with a specific role.

## Features

- Web dashboard to manage your Discord bot
- Send direct messages to users with specific roles
- View logs of bot activity
- Monitor bot status

## Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Discord bot token:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment on Render

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Push this code to your repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. Sign up or log in to [Render](https://render.com/)
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `discord-bot` (or any name you prefer)
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Select appropriate plan (Free tier works for basic usage)

5. Add Environment Variables:
   - Click on "Environment" tab
   - Add `DISCORD_TOKEN` with your Discord bot token value

6. Click "Create Web Service"

7. Wait for deployment to complete (may take a few minutes)

### Step 3: Verify Deployment

1. Once deployed, Render will provide a URL for your service
2. Visit the URL to access your Discord bot dashboard
3. Check the logs on Render to ensure the bot is running correctly

## Environment Variables

- `DISCORD_TOKEN`: Your Discord bot token (required)
- `NODE_ENV`: Set to `production` for deployment (Render sets this automatically)

## Troubleshooting

If you encounter issues:
1. Check Render logs for any errors
2. Ensure your Discord bot token is correctly set in environment variables
3. Verify that your bot has the necessary permissions in your Discord server

