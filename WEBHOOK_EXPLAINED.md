# 🔗 How Webhooks Work in ASAHE Chatbot System

## What is a Webhook?

A **webhook** is like a "phone call" from one service to another. Instead of your server constantly asking "Do you have any updates?" (polling), external services **push** data to your server when something happens.

Think of it like:
- **Polling** = You keep calling to check if mail arrived 📞📞📞
- **Webhook** = Post office calls you when mail arrives 📬☎️

---

## 🎯 Why We Need Webhooks in This System

### The Problem Without Webhooks

Without webhooks, here's what would happen:

```
User calls VAPI → VAPI processes → VAPI needs to save data
❌ But VAPI can't directly access your server's files/database
❌ VAPI doesn't know your server's internal structure
❌ VAPI can't execute your custom business logic
```

### The Solution: Webhooks

With webhooks, VAPI can **call your server** when it needs to do something:

```
User calls VAPI → VAPI processes → VAPI calls YOUR webhook
✅ Your server receives the request
✅ Your server executes YOUR code
✅ Your server saves to YOUR database/files
✅ Your server returns result to VAPI
✅ VAPI tells the user the result
```

---

## 🔄 How Webhooks Work in Our System

### Step-by-Step Flow

```
┌─────────────┐
│   Student   │
│  (on phone) │
└──────┬──────┘
       │
       │ "I want to apply for Bachelor of Business"
       ▼
┌─────────────────┐
│  VAPI Assistant │
│  (in the cloud) │
└──────┬──────────┘
       │
       │ VAPI understands: "Need to create admission"
       │ VAPI has function: createAdmissionApplication
       │
       │ VAPI needs YOUR server to execute this function
       │
       ▼
┌─────────────────────────────────────────────┐
│  VAPI sends HTTP POST request to webhook:    │
│  POST https://your-server.com/api/vapi/webhook│
│                                              │
│  Body: {                                    │
│    message: {                                │
│      type: "tool-calls",                     │
│      toolCalls: [{                           │
│        function: {                           │
│          name: "createAdmissionApplication",  │
│          arguments: {                        │
│            firstName: "John",                │
│            lastName: "Doe",                  │
│            email: "john@example.com",         │
│            programme: "Bachelor of Business", │
│            ...                                │
│          }                                    │
│        }                                      │
│      }]                                       │
│    }                                          │
│  }                                            │
└──────┬───────────────────────────────────────┘
       │
       │ This request travels through:
       │ 1. Internet
       │ 2. Ngrok tunnel (if local dev)
       │ 3. Your Express server
       │
       ▼
┌─────────────────────────────────────────────┐
│  Your Server (server.js)                     │
│  Receives webhook at:                        │
│  POST /api/vapi/webhook                      │
│                                              │
│  Code executes:                              │
│  1. Parse the function call                  │
│  2. Extract parameters (name, email, etc.)    │
│  3. Validate data                            │
│  4. Save to data/admissions.json             │
│  5. Generate unique application ID           │
│  6. Return success response                  │
└──────┬───────────────────────────────────────┘
       │
       │ Response sent back:
       │ {
       │   results: [{
       │     toolCallId: "abc123",
       │     result: {
       │       success: true,
       │       admissionId: "adm_1234567890",
       │       message: "Application submitted..."
       │     }
       │   }]
       │ }
       │
       ▼
┌─────────────────┐
│  VAPI Assistant │
└──────┬──────────┘
       │
       │ VAPI receives the result
       │ VAPI converts to natural language
       │
       ▼
┌─────────────┐
│   Student   │
│  (on phone) │
└─────────────┘
       │
       │ "Your application has been submitted successfully!
       │  Your application ID is adm_1234567890."
       │
```

---

## 💡 What Webhooks Enable

### 1. **Function Execution**

When VAPI needs to perform an action (like creating an admission), it calls your webhook:

```javascript
// VAPI sends this to your webhook:
{
  message: {
    type: "tool-calls",
    toolCalls: [{
      function: {
        name: "createAdmissionApplication",
        arguments: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          programme: "Bachelor of Business",
          intake: "February 2026"
        }
      }
    }]
  }
}

// Your server processes it:
app.post('/api/vapi/webhook', async (req, res) => {
  const toolCall = req.body.message.toolCalls[0];
  const functionName = toolCall.function.name;
  const params = toolCall.function.arguments;
  
  // Execute YOUR code
  if (functionName === 'createAdmissionApplication') {
    const result = await createAdmissionApplication(params);
    return res.json({ results: [{ result }] });
  }
});
```

### 2. **Real-Time Data Updates**

Webhooks enable **real-time** updates:

- ✅ Student applies → Webhook fires → Data saved immediately
- ✅ Admin approves → Status updated → Student can check instantly
- ✅ No delays, no polling, no waiting

### 3. **Custom Business Logic**

Your server can execute **any custom logic**:

```javascript
// Example: Custom validation
if (params.email.includes('@gmail.com')) {
  // Special handling for Gmail users
}

// Example: Integration with other services
await sendEmail(params.email, 'Welcome to ASAHE!');
await logToAnalytics(params);

// Example: Complex calculations
const applicationFee = calculateFee(params.programme, params.country);
```

### 4. **Data Storage Control**

You control **where and how** data is stored:

```javascript
// Save to JSON file (current)
await fs.writeFile('data/admissions.json', ...);

// Or save to database (future)
await db.admissions.create({ ... });

// Or save to multiple places
await saveToDatabase(data);
await saveToCRM(data);
await saveToAnalytics(data);
```

---

## 🔍 Real Example from Our Code

### When Student Applies via Voice Call

**1. Student says:** "I want to apply for Bachelor of Business"

**2. VAPI collects information:**
- First name: "John"
- Last name: "Doe"
- Email: "john@example.com"
- Phone: "+61 400 000 000"
- Programme: "Bachelor of Business"
- Intake: "February 2026"

**3. VAPI calls webhook:**
```http
POST https://your-ngrok-url.ngrok-free.app/api/vapi/webhook
Content-Type: application/json

{
  "message": {
    "type": "tool-calls",
    "toolCalls": [{
      "function": {
        "name": "createAdmissionApplication",
        "arguments": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phone": "+61 400 000 000",
          "programme": "Bachelor of Business",
          "intake": "February 2026"
        }
      }
    }]
  }
}
```

**4. Your server receives it:**
```javascript
// server.js line 117
app.post('/api/vapi/webhook', async (req, res) => {
  const toolCalls = req.body.message.toolCalls;
  
  // Process each function call
  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;
    const params = toolCall.function.arguments;
    
    // Execute the function
    const result = await createAdmissionApplication(params);
    // Returns: { success: true, admissionId: "adm_123..." }
  }
});
```

**5. Server saves data:**
```javascript
// server.js line 293
async function createAdmissionApplication(params) {
  const admission = {
    id: `adm_${Date.now()}_${Math.random()}`,
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    // ... all other fields
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Save to file
  await saveAdmission(admission);
  
  return {
    success: true,
    admissionId: admission.id,
    message: "Application submitted successfully!"
  };
}
```

**6. Server responds to VAPI:**
```json
{
  "results": [{
    "toolCallId": "abc123",
    "result": {
      "success": true,
      "admissionId": "adm_1234567890",
      "message": "Your application has been submitted successfully. Your application ID is adm_1234567890."
    }
  }]
}
```

**7. VAPI tells student:**
> "Your application has been submitted successfully! Your application ID is adm_1234567890. An admin will review it shortly."

**8. Admin sees it in panel:**
- Admin logs into admin panel
- Sees new application in the list
- Can approve/reject it

---

## 🎯 Key Benefits of Webhooks

### ✅ **Separation of Concerns**
- VAPI handles: Voice recognition, AI conversation, speech synthesis
- Your server handles: Data storage, business logic, integrations

### ✅ **Security**
- Your database/files are not exposed to VAPI
- VAPI only calls your webhook endpoint
- You control what data is accessible

### ✅ **Flexibility**
- You can change your database without affecting VAPI
- You can add new functions without changing VAPI config
- You can integrate with other services (email, SMS, CRM)

### ✅ **Real-Time Processing**
- No delays or polling
- Instant data updates
- Immediate user feedback

### ✅ **Scalability**
- Your server can handle multiple VAPI calls
- You can add caching, rate limiting, etc.
- You can scale your server independently

---

## 🔧 Webhook Configuration

### In VAPI Dashboard

You configure the webhook URL:
```
Server URL: https://your-ngrok-url.ngrok-free.app/api/vapi/webhook
Webhook Secret: your-secret-key
```

### In Your Server

You receive webhooks at:
```javascript
app.post('/api/vapi/webhook', async (req, res) => {
  // Handle webhook events
});
```

### For Local Development

Use **ngrok** to expose your local server:
```bash
# Terminal 1: Start your server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Use the ngrok URL in VAPI dashboard
```

---

## 📊 Webhook Event Types

VAPI sends different types of events:

### 1. **Function Calls** (Most Important)
```json
{
  "message": {
    "type": "tool-calls",
    "toolCalls": [...]
  }
}
```
**Purpose**: Execute functions (create admission, check status, etc.)

### 2. **Status Updates**
```json
{
  "message": {
    "type": "status-update",
    "call": { "status": "ringing" }
  }
}
```
**Purpose**: Track call status (ringing, answered, ended)

### 3. **Transcripts**
```json
{
  "message": {
    "type": "transcript",
    "content": "User said: I want to apply..."
  }
}
```
**Purpose**: Get conversation transcripts

### 4. **Call Ended**
```json
{
  "message": {
    "type": "hang",
    "call": { "id": "call_123" }
  }
}
```
**Purpose**: Know when call ends

---

## 🚨 Common Webhook Issues

### Issue: Webhook not receiving requests
**Causes:**
- Ngrok not running
- Wrong URL in VAPI dashboard
- Server not running
- Firewall blocking requests

**Solution:**
```bash
# Check ngrok
curl http://localhost:4040/api/tunnels

# Check server
curl http://localhost:3000/api/health

# Check webhook URL matches
# VAPI dashboard URL should match ngrok URL
```

### Issue: Function not executing
**Causes:**
- Function name mismatch
- Missing required parameters
- Server error

**Solution:**
- Check server logs
- Verify function names match
- Test function directly

---

## 🎓 Summary

**Webhooks are the bridge between VAPI and your server:**

1. **VAPI** handles the conversation (voice, AI, speech)
2. **Webhook** connects VAPI to your server
3. **Your server** handles data and business logic
4. **Result**: Complete system working together seamlessly

**Without webhooks:**
- ❌ VAPI can't save data to your server
- ❌ VAPI can't execute your custom functions
- ❌ VAPI can't access your database/files
- ❌ System would be disconnected

**With webhooks:**
- ✅ VAPI can call your functions
- ✅ Your server processes and saves data
- ✅ Real-time updates
- ✅ Complete integration

---

**Think of webhooks as the "phone line" that lets VAPI talk to your server!** 📞➡️💻

