# ASA-Bot (ASAHE) — Complete System

This repo contains a complete ASAHE chatbot system with:
- **Chatbase Integration**: Text-based chat assistant
- **VAPI Integration**: Voice AI assistant for admissions and phone calls
- **Admin Panel**: Admission management and approval system
- **Backend API**: Node.js Express server with webhooks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file (see `.env.example`):

```env
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_assistant_id
PORT=3000
ADMIN_EMAIL=admin@asahe.edu.au
ADMIN_PASSWORD=your_password
```

### 3. Start the Server

```bash
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000 (or open `index.html`)
- **Admin Panel**: http://localhost:3000/admin.html

## Features

### Chatbase (Text Chat)
- Embedded chat widget for text-based assistance
- Bot ID: `bVrB07H2M1k0K0bN59FGy`
- System prompt: See `SYSTEM_PROMPT.md`

### VAPI (Voice Calls)
- Voice AI assistant for phone calls
- Handles admissions, course info, status checks
- System prompt: See `VAPI_SYSTEM_PROMPT.md`
- Functions: See `VAPI_FUNCTIONS.md`

### Admin Panel
- View all admission applications
- Approve/reject applications
- Statistics dashboard
- Access at `/admin.html`

## Setup Guides

- **VAPI Setup**: See `SETUP_GUIDE.md` for detailed VAPI configuration
- **Chatbase Setup**: See `CHATBASE_EMBED_EXPLAINED.md` for chat widget details

## Project Structure

```
ASA Chatbot/
├── server.js                 # Express backend
├── index.html               # Main frontend
├── admin.html               # Admin panel
├── package.json             # Dependencies
├── data/                    # Local storage (auto-created)
│   ├── admissions.json      # Admission applications
│   └── admin.json           # Admin config
├── VAPI_SYSTEM_PROMPT.md    # VAPI assistant prompt
├── VAPI_FUNCTIONS.md        # VAPI function definitions
├── SYSTEM_PROMPT.md         # Chatbase system prompt
└── SETUP_GUIDE.md           # Complete setup instructions
```

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/vapi/config` - VAPI configuration
- `POST /api/vapi/call` - Initiate VAPI call
- `POST /api/vapi/webhook` - VAPI webhook handler

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/admissions` - Get all admissions
- `POST /api/admin/admissions/:id/approve` - Approve/reject

## Canonical ASAHE Links

- Home: https://asahe.edu.au/
- Courses: https://asahe.edu.au/courses/
- International: https://asahe.edu.au/international-students/
- Student Support: https://asahe.edu.au/student-support/
- About: https://asahe.edu.au/about-us/
- Contact: https://asahe.edu.au/contact-us/
- Fees & Refunds: https://asahe.edu.au/fees-and-refunds/
- Admissions: https://asahe.edu.au/admissions/
- Student Portal: https://asahe.edu.au/student-portal/

## Development

- Colours: Navy `#002E5D`, Gold `#D4AF37`, Teal `#007B7F`
- Backend: Node.js with Express
- Storage: JSON files (MVP - upgrade to database for production)
- Webhooks: VAPI calls functions via webhook endpoint

## Next Steps

1. Set up VAPI account and configure assistant (see `SETUP_GUIDE.md`)
2. Configure webhook URL (use ngrok for local testing)
3. Test voice calls and function execution
4. Set up admin credentials
5. Deploy to production server


