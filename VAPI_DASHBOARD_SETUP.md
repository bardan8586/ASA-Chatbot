# 📋 How to Configure Webhook in VAPI Dashboard

## Step-by-Step Guide

### Step 1: Access VAPI Dashboard
1. Go to **https://dashboard.vapi.ai**
2. Log in with your VAPI account credentials

### Step 2: Navigate to Your Assistant
1. Click on **"Assistants"** in the left sidebar (or top navigation)
2. Find your assistant with ID: `56e48d6c-029d-459b-aff9-132002e508b6`
3. Click on the assistant name to open its settings

### Step 3: Configure Server/Webhook Settings

#### Option A: If you see "Server URL" section
1. Look for **"Server URL"** or **"Server Configuration"** section
2. Find the **"URL"** field
3. Enter: `https://louella-interacinous-consequently.ngrok-free.dev/api/vapi/webhook`
4. Find the **"Secret"** or **"Webhook Secret"** field
5. Enter: `mnfu8sFBDRVEoz4cdB6Jg5O-zvbJUAEpyAdorXHE45Q`
6. Click **"Save"** or **"Update"**

#### Option B: If you see "Functions" or "Serverless Functions" section
1. Look for **"Server URL"** field in the serverless functions configuration
2. Enter: `https://louella-interacinous-consequently.ngrok-free.dev/api/vapi/webhook`
3. Look for **"Secret"** or **"Webhook Secret"** field
4. Enter: `mnfu8sFBDRVEoz4cdB6Jg5O-zvbJUAEpyAdorXHE45Q`
5. Click **"Save"**

#### Option C: If you see "Advanced Settings" or "Configuration"
1. Click on **"Advanced Settings"** or **"Configuration"** tab
2. Scroll to **"Server"** or **"Webhook"** section
3. Enter the URL and secret as above
4. Save changes

### Step 4: Verify Configuration
1. After saving, verify the settings are saved correctly
2. The webhook URL should show your ngrok URL
3. The secret should be masked (showing only `****` or similar)

### Step 5: Test the Connection
1. In VAPI dashboard, look for a **"Test"** or **"Test Webhook"** button
2. Click it to verify the connection
3. Check your server logs to see if the test request arrives

## 📝 Configuration Values

**Webhook URL:**
```
https://louella-interacinous-consequently.ngrok-free.dev/api/vapi/webhook
```

**Webhook Secret:**
```
mnfu8sFBDRVEoz4cdB6Jg5O-zvbJUAEpyAdorXHE45Q
```

## 🔍 Where to Find These Settings

The exact location may vary based on VAPI dashboard version, but typically:

1. **Assistant Settings Page** → Scroll to "Server" or "Webhook" section
2. **Functions/Serverless** → Look for server URL configuration
3. **Advanced/Configuration Tab** → Server settings

## ⚠️ Important Notes

1. **Ngrok URL Changes**: If you restart ngrok, you'll need to update the URL in VAPI dashboard again
2. **Secret Security**: The secret should match exactly what's in your `.env` file
3. **Save Changes**: Always click "Save" or "Update" after making changes
4. **Test First**: Use the test button if available before making actual calls

## 🧪 Testing After Configuration

1. Make a test call from VAPI dashboard
2. Check your server logs at `http://localhost:3000`
3. Verify webhook requests are being received
4. Check if function calls are executing properly

## 📞 Troubleshooting

**If you can't find the settings:**
- Check if you're on the correct assistant
- Look for "Edit" or "Settings" button
- Try searching for "server" or "webhook" in the page

**If webhook doesn't work:**
- Verify ngrok is still running
- Check the URL is correct (no typos)
- Ensure secret matches exactly
- Check server logs for errors


