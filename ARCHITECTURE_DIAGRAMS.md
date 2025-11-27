# ASA-Bot Architecture Diagrams

This document contains visual diagrams for the ASA-Bot system including flowcharts, sitemap, and network architecture.

## 1. System Flowchart - User Journey

```mermaid
flowchart TD
    Start([User Visits Site]) --> HomePage[index.html<br/>ASA-Bot Preview]
    
    HomePage --> Choice{User Choice}
    
    Choice -->|Text Chat| Chatbase[Chatbase Widget<br/>Text-based Assistant]
    Choice -->|Voice Assistant| VoicePanel[Voice Assistant Panel<br/>Browser Speech Recognition]
    Choice -->|Start Application| IntakeForm[Intake Modal<br/>Application Form]
    Choice -->|Upload Documents| UploadModal[Upload Modal<br/>Document Upload]
    Choice -->|Admin Access| AdminLogin[Admin Login Page]
    
    Chatbase --> ChatbaseAPI[Chatbase API<br/>bVrB07H2M1k0K0bN59FGy]
    ChatbaseAPI --> ChatbaseResponse[AI Response]
    ChatbaseResponse --> User[User]
    
    VoicePanel --> SpeechRec[Browser Speech Recognition]
    SpeechRec --> ParseCommand[Parse Voice Command]
    ParseCommand --> VoiceActions{Command Type}
    
    VoiceActions -->|Open Chat| Chatbase
    VoiceActions -->|Start Application| IntakeForm
    VoiceActions -->|Upload| UploadModal
    VoiceActions -->|Courses/Fees/Info| ExternalLinks[Open ASAHE Website]
    VoiceActions -->|General Query| VoiceResponse[Voice Response]
    
    VoiceResponse --> LocalStorage[(LocalStorage<br/>Voice History)]
    
    IntakeForm --> SubmitIntake[Submit Application]
    SubmitIntake --> LocalStorage2[(LocalStorage<br/>Intake Data)]
    SubmitIntake --> DownloadJSON[Download JSON Summary]
    
    UploadModal --> SelectFiles[Select Files]
    SelectFiles --> UploadManifest[Create Upload Manifest]
    UploadManifest --> LocalStorage3[(LocalStorage<br/>Upload Manifest)]
    UploadManifest --> DownloadJSON2[Download JSON]
    
    AdminLogin --> AuthCheck{Authentication}
    AuthCheck -->|Valid| AdminPanel[Admin Dashboard]
    AuthCheck -->|Invalid| AdminLogin
    
    AdminPanel --> ViewAdmissions[View All Admissions]
    AdminPanel --> Stats[Statistics Dashboard]
    
    ViewAdmissions --> AdmissionActions{Action}
    AdmissionActions -->|Approve| ApproveAPI[POST /api/admin/admissions/:id/approve]
    AdmissionActions -->|Reject| RejectAPI[POST /api/admin/admissions/:id/approve]
    
    ApproveAPI --> UpdateStatus[Update Admission Status]
    RejectAPI --> UpdateStatus
    UpdateStatus --> JSONStorage[(data/admissions.json)]
    
    style Start fill:#002E5D,stroke:#fff,color:#fff
    style HomePage fill:#007B7F,stroke:#fff,color:#fff
    style Chatbase fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style VoicePanel fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style AdminPanel fill:#002E5D,stroke:#fff,color:#fff
    style JSONStorage fill:#007B7F,stroke:#fff,color:#fff
```

## 2. VAPI Voice Call Flowchart

```mermaid
sequenceDiagram
    participant User as User Phone
    participant VAPI as VAPI Platform
    participant Server as Express Server
    participant Webhook as /api/vapi/webhook
    participant Functions as VAPI Functions
    participant Storage as JSON Storage
    
    User->>VAPI: Initiates Phone Call
    VAPI->>User: Answers & Greets
    User->>VAPI: Speaks Query
    VAPI->>VAPI: Processes Speech (AI)
    
    alt Function Call Needed
        VAPI->>Webhook: POST /api/vapi/webhook<br/>(function-calling)
        Webhook->>Functions: Execute Function
        Functions->>Storage: Read/Write Data
        Storage-->>Functions: Return Data
        Functions-->>Webhook: Function Result
        Webhook-->>VAPI: JSON Response
        VAPI->>User: Speaks Response
    else Simple Query
        VAPI->>User: Direct AI Response
    end
    
    User->>VAPI: Continues Conversation
    VAPI->>User: Final Response
    VAPI->>Webhook: POST /api/vapi/webhook<br/>(call-ended)
    Webhook->>Storage: Save Call Log
```

## 3. Site Map / Application Structure

```mermaid
graph TB
    Root[ASA-Bot System] --> Frontend[Frontend Layer]
    Root --> Backend[Backend Layer]
    Root --> External[External Services]
    Root --> Storage[Data Storage]
    
    Frontend --> Index[index.html<br/>Main Preview Page]
    Frontend --> Admin[admin.html<br/>Admin Panel]
    Frontend --> Assets[assets/<br/>Static Files]
    
    Index --> Features[Features]
    Features --> ChatbaseWidget[Chatbase Widget]
    Features --> VoicePanel[Voice Assistant]
    Features --> IntakeModal[Intake Form]
    Features --> UploadModal[Upload Modal]
    
    Admin --> Login[Login Form]
    Admin --> Dashboard[Admin Dashboard]
    Dashboard --> StatsView[Statistics View]
    Dashboard --> AdmissionsList[Admissions List]
    Dashboard --> Actions[Approve/Reject Actions]
    
    Backend --> API[Express Server<br/>Port 3000]
    API --> PublicAPI[Public APIs]
    API --> AdminAPI[Admin APIs]
    
    PublicAPI --> Health[GET /api/health]
    PublicAPI --> VAPIConfig[GET /api/vapi/config]
    PublicAPI --> VAPICall[POST /api/vapi/call]
    PublicAPI --> VAPIWebhook[POST /api/vapi/webhook]
    
    AdminAPI --> AdminLogin[POST /api/admin/login]
    AdminAPI --> GetAdmissions[GET /api/admin/admissions]
    AdminAPI --> ApproveAdmission[POST /api/admin/admissions/:id/approve]
    
    External --> Chatbase[Chatbase.co<br/>Text Chat Service]
    External --> VAPI[VAPI.ai<br/>Voice AI Service]
    External --> Ngrok[Ngrok<br/>Tunnel Service]
    External --> ASAHE[ASAHE.edu.au<br/>Main Website]
    
    Storage --> AdmissionsJSON[data/admissions.json]
    Storage --> AdminJSON[data/admin.json]
    Storage --> LocalStorage[Browser LocalStorage]
    
    LocalStorage --> VoiceHistory[asa.voice.history]
    LocalStorage --> IntakeData[asa.intakes]
    LocalStorage --> UploadData[asa.uploads]
    
    style Root fill:#002E5D,stroke:#fff,color:#fff
    style Frontend fill:#007B7F,stroke:#fff,color:#fff
    style Backend fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style External fill:#007B7F,stroke:#fff,color:#fff
    style Storage fill:#007B7F,stroke:#fff,color:#fff
```

## 4. Network Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser<br/>Chrome/Edge/Safari]
        Phone[User Phone<br/>Voice Calls]
    end
    
    subgraph "Frontend Application"
        IndexPage[index.html<br/>Port 3000]
        AdminPage[admin.html<br/>Port 3000]
    end
    
    subgraph "Backend Server"
        Express[Express Server<br/>Node.js :3000]
        API[API Routes]
        WebhookHandler[Webhook Handler]
    end
    
    subgraph "Local Storage"
        JSONFiles[(JSON Files<br/>data/)]
        LocalStorage[(Browser<br/>LocalStorage)]
    end
    
    subgraph "External Services"
        Chatbase[Chatbase.co<br/>Text Chat API]
        VAPI[VAPI.ai<br/>Voice AI Platform]
        Ngrok[Ngrok Tunnel<br/>HTTPS Proxy]
    end
    
    subgraph "VAPI Infrastructure"
        VAPIServer[VAPI Servers]
        VAPIPhone[Phone Number<br/>Voice Gateway]
    end
    
    Browser -->|HTTP/HTTPS| IndexPage
    Browser -->|HTTP/HTTPS| AdminPage
    Browser -->|WebSocket/HTTP| Chatbase
    Browser -->|Speech Recognition API| IndexPage
    
    IndexPage -->|API Calls| Express
    AdminPage -->|API Calls| Express
    
    Express --> API
    API -->|Read/Write| JSONFiles
    IndexPage -->|Store Data| LocalStorage
    
    Phone -->|PSTN/VoIP| VAPIPhone
    VAPIPhone --> VAPIServer
    VAPIServer -->|Webhook Events| Ngrok
    Ngrok -->|HTTPS Tunnel| Express
    Express --> WebhookHandler
    WebhookHandler -->|Function Calls| JSONFiles
    WebhookHandler -->|Response| VAPIServer
    VAPIServer -->|Voice Response| Phone
    
    Express -->|API Calls| VAPI
    VAPI -->|Webhook| Ngrok
    
    style Browser fill:#002E5D,stroke:#fff,color:#fff
    style Phone fill:#002E5D,stroke:#fff,color:#fff
    style Express fill:#007B7F,stroke:#fff,color:#fff
    style Chatbase fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style VAPI fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style Ngrok fill:#007B7F,stroke:#fff,color:#fff
    style JSONFiles fill:#007B7F,stroke:#fff,color:#fff
```

## 5. Data Flow Diagram

```mermaid
flowchart LR
    subgraph "User Input"
        TextInput[Text Message]
        VoiceInput[Voice Command]
        FormInput[Form Data]
    end
    
    subgraph "Processing"
        ChatbaseAI[Chatbase AI]
        VoiceParser[Voice Parser]
        FormValidator[Form Validator]
    end
    
    subgraph "Storage"
        LocalStorage[(LocalStorage)]
        JSONFiles[(JSON Files)]
    end
    
    subgraph "Output"
        ChatResponse[Chat Response]
        VoiceResponse[Voice Response]
        FileDownload[File Download]
    end
    
    TextInput --> ChatbaseAI
    VoiceInput --> VoiceParser
    FormInput --> FormValidator
    
    ChatbaseAI --> ChatResponse
    VoiceParser --> VoiceResponse
    FormValidator --> JSONFiles
    FormValidator --> FileDownload
    
    VoiceParser --> LocalStorage
    FormValidator --> LocalStorage
    
    style TextInput fill:#002E5D,stroke:#fff,color:#fff
    style VoiceInput fill:#002E5D,stroke:#fff,color:#fff
    style FormInput fill:#002E5D,stroke:#fff,color:#fff
    style ChatbaseAI fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style VoiceParser fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style LocalStorage fill:#007B7F,stroke:#fff,color:#fff
    style JSONFiles fill:#007B7F,stroke:#fff,color:#fff
```

## 6. API Request Flow

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant Frontend as Frontend HTML
    participant Server as Express Server
    participant Storage as JSON Storage
    participant External as External API
    
    Note over Client,External: Public API Flow
    Client->>Frontend: Load Page
    Frontend->>Server: GET /api/health
    Server-->>Frontend: {status: "ok", vapi: true}
    
    Frontend->>Server: GET /api/vapi/config
    Server-->>Frontend: {assistantId, hasApiKey}
    
    Note over Client,External: Admin Flow
    Client->>Frontend: Admin Login
    Frontend->>Server: POST /api/admin/login
    Server->>Storage: Verify Credentials
    Storage-->>Server: Auth Result
    Server-->>Frontend: {success: true/false}
    
    Frontend->>Server: GET /api/admin/admissions
    Server->>Storage: Read admissions.json
    Storage-->>Server: Admissions Data
    Server-->>Frontend: {success: true, admissions: [...]}
    
    Frontend->>Server: POST /api/admin/admissions/:id/approve
    Server->>Storage: Update Status
    Storage-->>Server: Updated Data
    Server-->>Frontend: {success: true}
    
    Note over Client,External: VAPI Webhook Flow
    External->>Server: POST /api/vapi/webhook
    Server->>Storage: Read/Write Data
    Storage-->>Server: Data
    Server-->>External: Function Response
```

## 7. Component Interaction Diagram

```mermaid
graph TB
    subgraph "Frontend Components"
        Index[index.html]
        Admin[admin.html]
        ChatbaseWidget[Chatbase Widget]
        VoicePanel[Voice Panel]
        IntakeModal[Intake Modal]
        UploadModal[Upload Modal]
    end
    
    subgraph "Backend Services"
        ExpressServer[Express Server]
        HealthEndpoint[/api/health]
        VAPIConfig[/api/vapi/config]
        VAPIWebhook[/api/vapi/webhook]
        AdminLogin[/api/admin/login]
        AdminAdmissions[/api/admin/admissions]
    end
    
    subgraph "External APIs"
        ChatbaseAPI[Chatbase API]
        VAPIService[VAPI Service]
    end
    
    subgraph "Data Layer"
        AdmissionsFile[admissions.json]
        AdminFile[admin.json]
        BrowserStorage[LocalStorage]
    end
    
    Index --> ChatbaseWidget
    Index --> VoicePanel
    Index --> IntakeModal
    Index --> UploadModal
    
    ChatbaseWidget <--> ChatbaseAPI
    VoicePanel --> BrowserStorage
    IntakeModal --> BrowserStorage
    UploadModal --> BrowserStorage
    
    Index --> HealthEndpoint
    Index --> VAPIConfig
    Admin --> AdminLogin
    Admin --> AdminAdmissions
    
    HealthEndpoint --> ExpressServer
    VAPIConfig --> ExpressServer
    VAPIWebhook --> ExpressServer
    AdminLogin --> ExpressServer
    AdminAdmissions --> ExpressServer
    
    ExpressServer --> AdmissionsFile
    ExpressServer --> AdminFile
    
    VAPIService --> VAPIWebhook
    
    style Index fill:#002E5D,stroke:#fff,color:#fff
    style Admin fill:#002E5D,stroke:#fff,color:#fff
    style ExpressServer fill:#007B7F,stroke:#fff,color:#fff
    style ChatbaseAPI fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
    style VAPIService fill:#D4AF37,stroke:#1E2B3A,color:#1E2B3A
```

## How to View These Diagrams

1. **VS Code**: Install the "Markdown Preview Mermaid Support" extension
2. **GitHub**: These diagrams will render automatically in GitHub markdown
3. **Online**: Use [Mermaid Live Editor](https://mermaid.live/) to view/edit
4. **Documentation**: Many markdown viewers support Mermaid diagrams

## Diagram Legend

- **Navy Blue (#002E5D)**: User-facing components, entry points
- **Teal (#007B7F)**: Backend services, data storage
- **Gold (#D4AF37)**: External services, APIs


