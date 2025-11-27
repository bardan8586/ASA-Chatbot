# 🚀 Local Development Setup Guide - Ngrok & Webhook

This guide will help you set up ngrok and configure the VAPI webhook for local development.

## Prerequisites

- Node.js installed (v16+)
- npm or yarn
- A VAPI account
- Your VAPI Assistant ID

---

## Step 1: Install Ngrok

### Option A: Using Homebrew (macOS)
```bash
brew install ngrok/ngrok/ngrok
```

### Option B: Using npm (Cross-platform)
```bash
npm install -g ngrok
```

### Option C: Direct Download
1. Go to https://ngrok.com/download
2. Download for your OS
3. Extract and add to PATH

---

## Step 2: Get Ngrok Auth Token

1. Sign up at https://dashboard.ngrok.com/signup (free account works)
2. Go to https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your authtoken
4. Run:
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

---

## Step 3: Set Up Local Server

1. **Clone/Download the project:**
```bash
git clone https://github.com/your-repo/ASA-Chatbot.git
cd ASA-Chatbot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
# Or create manually
```

4. **Add your environment variables to `.env`:**
```env
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here
PORT=3000
ADMIN_EMAIL=admin@asahe.edu.au
ADMIN_PASSWORD=your_admin_password
```

5. **Start the server:**
```bash
npm run dev
# or
npm start
```

You should see:
```
🚀 ASA Chatbot Backend running on http://localhost:3000
📞 VAPI Webhook: http://localhost:3000/api/vapi/webhook
```

---

## Step 4: Start Ngrok Tunnel

**In a NEW terminal window**, run:

```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

**Important:** Copy the `https://` URL (the forwarding URL). This is your public webhook URL.

---

## Step 5: Configure Webhook in VAPI Dashboard

1. **Go to VAPI Dashboard:**
   - Visit: https://dashboard.vapi.ai
   - Log in to your account

2. **Find Your Assistant:**
   - Click **"Assistants"** in the left sidebar
   - Find your assistant (or create a new one)
   - Click on the assistant name to open settings

3. **Configure Webhook:**
   - Navigate to **"Advanced"** tab (or look for "Server" / "Webhook" section)
   - Find **"Server URL"** or **"Webhook URL"** field
   - Enter: `https://YOUR-NGROK-URL.ngrok-free.app/api/vapi/webhook`
     - Example: `https://abc123.ngrok-free.app/api/vapi/webhook`
   
4. **Add Webhook Secret (if required):**
   - Find **"Webhook Secret"** or **"Server Secret"** field
   - Enter the secret from your `.env` file: `VAPI_WEBHOOK_SECRET`
   - Or generate a new one (keep it secure!)

5. **Save the configuration**

---

## Step 6: Test the Connection

### Test 1: Check if webhook endpoint is accessible
```bash
curl -X POST https://YOUR-NGROK-URL.ngrok-free.app/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'
```

You should get a response from your server.

### Test 2: Check server logs
Look at your server terminal. You should see:
```
📞 VAPI Webhook received: { "test": "connection" }
```

### Test 3: Make a test call from VAPI
1. In VAPI dashboard, go to your assistant
2. Click **"Test"** or **"Talk to Assistant"**
3. Make a test call
4. Check your server logs - you should see webhook events

---

## Step 7: Verify Function Calls

When you make a call and the assistant uses functions:

1. **Check server logs** - you should see:
   ```
   🔧 Tool calls found: [...]
   🔧 Function call: createAdmissionApplication
   ✅ Admission created: adm_1234567890
   ```

2. **Check data files:**
   ```bash
   cat data/admissions.json
   ```
   You should see new admission entries.

3. **Check admin panel:**
   - Open: http://localhost:3000/admin.html
   - Login with your admin credentials
   - You should see the new admissions

---

## Troubleshooting

### ❌ "Tunnel not found" or "Connection refused"
- Make sure ngrok is running: `ngrok http 3000`
- Make sure your server is running: `npm run dev`
- Check the port matches (default: 3000)

### ❌ "Webhook not receiving requests"
- Verify ngrok URL is correct in VAPI dashboard
- Check ngrok web interface: http://127.0.0.1:4040
- Look at the "Requests" tab in ngrok to see if requests are coming through
- Check server logs for errors

### ❌ "Invalid webhook secret"
- Make sure `VAPI_WEBHOOK_SECRET` in `.env` matches what's in VAPI dashboard
- Regenerate secret if needed

### ❌ "Function not found" errors
- Check server.js has the function handlers
- Verify function names match between VAPI dashboard and server.js
- Check server logs for detailed error messages

### ❌ Ngrok URL changes every time
- **Free ngrok accounts** get a new URL each time you restart
- **Solution:** Update the webhook URL in VAPI dashboard each time you restart ngrok
- **Alternative:** Use ngrok's reserved domains (paid feature) for a permanent URL

---

## Quick Reference Commands

```bash
# Start server
npm run dev

# Start ngrok (in separate terminal)
ngrok http 3000

# Check server health
curl http://localhost:3000/api/health

# Test webhook
curl -X POST https://YOUR-NGROK-URL.ngrok-free.app/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# View ngrok web interface
open http://127.0.0.1:4040
```

---

## Important Notes

1. **Keep ngrok running:** Don't close the ngrok terminal while testing
2. **Update webhook URL:** Every time you restart ngrok, update the URL in VAPI dashboard
3. **Environment variables:** Never commit `.env` file to git (it should be in `.gitignore`)
4. **Port conflicts:** If port 3000 is busy, change `PORT` in `.env` and update ngrok: `ngrok http NEW_PORT`

---

## Next Steps

- ✅ Test voice calls from VAPI dashboard
- ✅ Test function calls (create admission, check status, etc.)
- ✅ Verify data is saved to `data/admissions.json`
- ✅ Check admin panel shows new admissions
- ✅ Set up production deployment (replace ngrok with permanent domain)

---

## Need Help?

- Check server logs for detailed error messages
- Use ngrok web interface (http://127.0.0.1:4040) to inspect requests
- Verify all environment variables are set correctly
- Make sure both server and ngrok are running

