# Chatbase Embed - Behind the Scenes

## How Chatbase is Embedded in ASA-Bot

### Current Implementation

The Chatbase widget is embedded using an **asynchronous loading pattern** that ensures it doesn't block page rendering.

### Step-by-Step Breakdown

#### 1. **Queue Pattern (Lines 334-336)**
```javascript
if(!window.chatbase||window.chatbase("getState")!=="initialized"){
  window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};
  window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})
}
```

**What's happening:**
- Creates a **queue system** (`window.chatbase.q`) to store API calls made before the Chatbase script loads
- Uses a **Proxy** to intercept method calls (like `chatbase('open')`) and queue them
- This allows you to call `chatbase('open')` immediately, even if the script hasn't loaded yet
- Once Chatbase loads, it processes all queued commands

**Example:**
```javascript
// This works even if Chatbase hasn't loaded yet
window.chatbase('open'); // Gets queued
window.chatbase('sendMessage', 'Hello'); // Gets queued
// When Chatbase loads, both commands execute
```

#### 2. **Script Loading (Lines 338-344)**
```javascript
const onLoad=function(){
  const script=document.createElement("script");
  script.src="https://www.chatbase.co/embed.min.js";
  script.id="bVrB07H2M1k0K0bN59FGy"; // ASA-Bot widget id
  script.domain="www.chatbase.co";
  document.body.appendChild(script)
};
```

**What's happening:**
- Dynamically creates a `<script>` tag (doesn't block HTML parsing)
- Loads the Chatbase embed script from their CDN
- Sets the **bot ID** (`bVrB07H2M1k0K0bN59FGy`) - this identifies your specific ASA-Bot
- Appends to `<body>` to trigger the download

#### 3. **Load Timing (Line 345)**
```javascript
if(document.readyState==="complete"){onLoad()} else { window.addEventListener("load",onLoad) }
```

**What's happening:**
- If page is already loaded → load Chatbase immediately
- Otherwise → wait for `window.load` event (after all resources load)
- This ensures Chatbase loads after your page is ready

### What Happens When Chatbase Loads

1. **Script Execution:**
   - Chatbase's `embed.min.js` executes
   - It reads the `script.id` to identify your bot
   - Initializes the widget with your bot's configuration

2. **Widget Creation:**
   - Creates a floating chat bubble (usually bottom-right)
   - Loads your bot's system prompt/instructions
   - Connects to Chatbase's API servers

3. **Queue Processing:**
   - Processes all commands in `window.chatbase.q`
   - Replaces the queue with the real Chatbase API

4. **Widget Display:**
   - Shows the chat bubble icon
   - Ready to receive user interactions

### How We Use It in ASA-Bot

#### Opening the Chat Programmatically:
```javascript
// In our code (lines 357, 548, 755)
try { 
  window.chatbase('open'); 
} catch(e) { 
  /* fallback */ 
}
```

**What this does:**
- Calls Chatbase's `open()` method
- Opens the chat widget if it's closed
- Works whether Chatbase has loaded or not (thanks to queue)

### Chatbase Bot Configuration

Your bot ID: `bVrB07H2M1k0K0bN59FGy`

**To configure the bot:**
1. Log into Chatbase dashboard
2. Find bot with this ID
3. Paste the system prompt from `SYSTEM_PROMPT.md`
4. Set temperature: 0.15-0.30
5. Set max tokens: ~300
6. Configure any additional settings

### Behind the Scenes Flow

```
Page Load
    ↓
Create chatbase queue/proxy
    ↓
Wait for window.load event
    ↓
Create <script> tag
    ↓
Load embed.min.js from CDN
    ↓
Chatbase script executes
    ↓
Reads bot ID from script.id
    ↓
Fetches bot config from Chatbase API
    ↓
Creates chat widget UI
    ↓
Processes queued commands
    ↓
Widget ready for interaction
```

### Network Requests (What You'll See in DevTools)

1. **Initial Load:**
   - `GET https://www.chatbase.co/embed.min.js` (the widget script)

2. **Bot Configuration:**
   - `GET https://www.chatbase.co/api/...` (fetches your bot's settings)

3. **Chat Interactions:**
   - `POST https://www.chatbase.co/api/chat/...` (sends messages)
   - `GET https://www.chatbase.co/api/chat/...` (receives responses)

4. **Analytics:**
   - `POST https://www.chatbase.co/api/analytics/...` (tracks conversations)

### Security & Privacy

- **HTTPS only:** All Chatbase requests use HTTPS
- **CORS:** Chatbase handles cross-origin requests
- **Data:** Conversations are stored on Chatbase servers (check their privacy policy)
- **No sensitive data:** Don't send PII through the chat (as per your system prompt)

### Customization Options

You can customize the widget appearance in Chatbase dashboard:
- Chat bubble position
- Colors/branding
- Welcome message
- Typing indicators
- etc.

### Troubleshooting

**Widget not appearing?**
1. Check browser console for errors
2. Verify bot ID is correct
3. Check if Chatbase script loaded (Network tab)
4. Ensure HTTPS (required for mic permissions)

**Commands not working?**
1. Check if `window.chatbase` exists
2. Verify Chatbase script loaded
3. Check console for API errors

### Next Steps

When you're ready to connect backend:
- Chatbase webhooks can send conversation data to your server
- You can programmatically send messages via Chatbase API
- Analytics dashboard shows conversation metrics

