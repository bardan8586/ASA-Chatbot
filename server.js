import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// VAPI API Configuration
const VAPI_API_URL = 'https://api.vapi.ai';
const VAPI_API_KEY = process.env.VAPI_API_KEY || '';

// Helper function to make VAPI API calls
async function vapiRequest(endpoint, method = 'GET', body = null) {
  const url = `${VAPI_API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('VAPI API error:', error);
    return { success: false, error: error.message };
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (index.html)

// Data directory for MVP (local storage)
const DATA_DIR = join(__dirname, 'data');
const ADMISSIONS_FILE = join(DATA_DIR, 'admissions.json');
const ADMIN_FILE = join(DATA_DIR, 'admin.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Initialize files if they don't exist
    try {
      await fs.access(ADMISSIONS_FILE);
    } catch {
      await fs.writeFile(ADMISSIONS_FILE, JSON.stringify([], null, 2));
    }
    try {
      await fs.access(ADMIN_FILE);
    } catch {
      await fs.writeFile(ADMIN_FILE, JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@asahe.edu.au',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        approvedAdmissions: []
      }, null, 2));
    }
  } catch (error) {
    console.error('Error setting up data directory:', error);
  }
}

// Helper functions for data operations
async function readAdmissions() {
  try {
    const data = await fs.readFile(ADMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAdmission(admission) {
  const admissions = await readAdmissions();
  admissions.push(admission);
  await fs.writeFile(ADMISSIONS_FILE, JSON.stringify(admissions, null, 2));
  return admission;
}

async function updateAdmission(id, updates) {
  const admissions = await readAdmissions();
  const index = admissions.findIndex(a => a.id === id);
  if (index !== -1) {
    admissions[index] = { ...admissions[index], ...updates };
    await fs.writeFile(ADMISSIONS_FILE, JSON.stringify(admissions, null, 2));
    return admissions[index];
  }
  return null;
}

async function getAdmission(id) {
  const admissions = await readAdmissions();
  return admissions.find(a => a.id === id);
}

// ==================== VAPI WEBHOOKS ====================

// Main webhook endpoint for VAPI events
app.post('/api/vapi/webhook', async (req, res) => {
  console.log('📞 VAPI Webhook received:', req.body);
  
  const { event, call, message, functionCall } = req.body;
  
  try {
    // Handle different VAPI events
    switch (event) {
      case 'function-call':
        return await handleFunctionCall(functionCall, call, res);
      
      case 'status-update':
        console.log(`Call ${call?.id} status: ${call?.status}`);
        return res.json({ success: true });
      
      case 'transcript':
        console.log(`Transcript: ${message?.content}`);
        return res.json({ success: true });
      
      case 'hang':
        console.log(`Call ${call?.id} ended`);
        return res.json({ success: true });
      
      default:
        console.log(`Unhandled event: ${event}`);
        return res.json({ success: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle VAPI function calls
async function handleFunctionCall(functionCall, call, res) {
  const { name, parameters } = functionCall;
  
  console.log(`🔧 Function call: ${name}`, parameters);
  
  try {
    let result;
    
    switch (name) {
      case 'createAdmissionApplication':
        result = await createAdmissionApplication(parameters);
        break;
      
      case 'checkAdmissionStatus':
        result = await checkAdmissionStatus(parameters);
        break;
      
      case 'getCourseInformation':
        result = await getCourseInformation(parameters);
        break;
      
      case 'scheduleAppointment':
        result = await scheduleAppointment(parameters);
        break;
      
      default:
        result = { error: `Unknown function: ${name}` };
    }
    
    return res.json({
      result: result
    });
  } catch (error) {
    console.error(`Error handling function ${name}:`, error);
    return res.json({
      result: { error: error.message }
    });
  }
}

// ==================== VAPI FUNCTIONS ====================

async function createAdmissionApplication(params) {
  const {
    firstName,
    lastName,
    email,
    phone,
    programme,
    intake,
    country,
    educationLevel,
    notes
  } = params;
  
  const admission = {
    id: `adm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    firstName,
    lastName,
    email,
    phone,
    programme,
    intake,
    country,
    educationLevel,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
    source: 'vapi_voice_call'
  };
  
  await saveAdmission(admission);
  console.log('✅ Admission created:', admission.id);
  
  return {
    success: true,
    admissionId: admission.id,
    message: `Your application has been submitted successfully. Your application ID is ${admission.id}. An admin will review it shortly.`
  };
}

async function checkAdmissionStatus(params) {
  const { admissionId, email } = params;
  
  let admission;
  if (admissionId) {
    admission = await getAdmission(admissionId);
  } else if (email) {
    const admissions = await readAdmissions();
    admission = admissions.find(a => a.email === email);
    if (admissions.filter(a => a.email === email).length > 1) {
      return {
        success: false,
        message: 'Multiple applications found. Please provide your application ID for a specific status check.'
      };
    }
  } else {
    return {
      success: false,
      message: 'Please provide either an application ID or email address.'
    };
  }
  
  if (!admission) {
    return {
      success: false,
      message: 'Application not found. Please verify your application ID or email.'
    };
  }
  
  return {
    success: true,
    status: admission.status,
    admissionId: admission.id,
    programme: admission.programme,
    intake: admission.intake,
    message: `Your application status is: ${admission.status.toUpperCase()}. ${admission.status === 'approved' ? 'Congratulations! You can proceed with enrollment.' : admission.status === 'pending' ? 'Your application is under review.' : 'Please contact admissions for more information.'}`
  };
}

async function getCourseInformation(params) {
  const { courseName } = params;
  
  // Course information (can be expanded)
  const courses = {
    'business': {
      name: 'Bachelor of Business',
      duration: '3 years',
      intake: 'February, July',
      fees: 'Contact for current fees',
      requirements: 'Year 12 or equivalent',
      link: 'https://asahe.edu.au/courses/'
    },
    'it': {
      name: 'Bachelor of Information Technology',
      duration: '3 years',
      intake: 'February, July',
      fees: 'Contact for current fees',
      requirements: 'Year 12 or equivalent',
      link: 'https://asahe.edu.au/courses/'
    }
  };
  
  const courseKey = courseName?.toLowerCase().replace(/\s+/g, '');
  const course = courses[courseKey] || courses['business'];
  
  return {
    success: true,
    course: course.name,
    duration: course.duration,
    intake: course.intake,
    fees: course.fees,
    requirements: course.requirements,
    message: `${course.name} is a ${course.duration} programme with intakes in ${course.intake}. For detailed information and current fees, visit ${course.link}`
  };
}

async function scheduleAppointment(params) {
  const { date, time, type, studentEmail } = params;
  
  // For MVP, just log the appointment
  const appointment = {
    id: `apt_${Date.now()}`,
    date,
    time,
    type: type || 'admission_consultation',
    studentEmail,
    createdAt: new Date().toISOString()
  };
  
  // In production, save to appointments database
  console.log('📅 Appointment scheduled:', appointment);
  
  return {
    success: true,
    appointmentId: appointment.id,
    message: `Your ${type || 'appointment'} has been scheduled for ${date} at ${time}. You will receive a confirmation email shortly.`
  };
}

// ==================== ADMIN ENDPOINTS ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf-8'));
    
    if (adminData.email === email && adminData.password === password) {
      // In production, use JWT tokens
      return res.json({
        success: true,
        message: 'Login successful',
        admin: { email: adminData.email }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all admissions (admin only)
app.get('/api/admin/admissions', async (req, res) => {
  try {
    const admissions = await readAdmissions();
    return res.json({ success: true, admissions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Approve/reject admission (admin only)
app.post('/api/admin/admissions/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { action, adminEmail } = req.body; // action: 'approve' or 'reject'
  
  try {
    const admission = await updateAdmission(id, {
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString()
    });
    
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    
    return res.json({
      success: true,
      admission,
      message: `Admission ${action}d successfully`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==================== PUBLIC API ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ASA Chatbot Backend',
    vapi: !!process.env.VAPI_API_KEY 
  });
});

// Get VAPI assistant configuration
app.get('/api/vapi/config', (req, res) => {
  res.json({
    assistantId: process.env.VAPI_ASSISTANT_ID,
    hasApiKey: !!process.env.VAPI_API_KEY
  });
});

// Initiate a VAPI call (for testing)
app.post('/api/vapi/call', async (req, res) => {
  const { phoneNumber } = req.body;
  
  console.log('📞 Call request received for:', phoneNumber);
  
  if (!VAPI_API_KEY || !process.env.VAPI_ASSISTANT_ID) {
    console.error('❌ VAPI not configured');
    return res.status(500).json({ 
      error: 'VAPI not configured. Please set VAPI_API_KEY and VAPI_ASSISTANT_ID in .env' 
    });
  }
  
  try {
    const callData = {
      customer: {
        number: phoneNumber
      },
      assistantId: process.env.VAPI_ASSISTANT_ID
    };
    
    // Only add phoneNumberId if it's set, not empty, and looks like a UUID
    // phoneNumberId must be a UUID, not a phone number
    if (process.env.VAPI_PHONE_NUMBER_ID && 
        process.env.VAPI_PHONE_NUMBER_ID.trim() !== '' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.VAPI_PHONE_NUMBER_ID.trim())) {
      callData.phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID.trim();
    }
    
    console.log('📤 Sending call request to VAPI:', JSON.stringify(callData, null, 2));
    
    const result = await vapiRequest('/call', 'POST', callData);
    
    console.log('📥 VAPI response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Call initiated successfully:', result.data?.id);
      return res.json({ success: true, call: result.data });
    } else {
      console.error('❌ Call failed:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to create call' });
    }
  } catch (error) {
    console.error('❌ VAPI call error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Initialize data directory on startup
ensureDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ASA Chatbot Backend running on http://localhost:${PORT}`);
    console.log(`📞 VAPI Webhook: http://localhost:${PORT}/api/vapi/webhook`);
    console.log(`🔧 VAPI configured: ${!!process.env.VAPI_API_KEY}`);
  });
});


