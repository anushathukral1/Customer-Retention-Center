# Customer Retention Center (Tavus CVI)

A small Next.js app that spins up a **real-time Tavus Conversational Video Interface (CVI)** session where an AI Customer Success Director can review an account, assess renewal risk, and recommend a retention playbook.

## What it does
- Starts a Tavus CVI video conversation (AI avatar + voice) on page load
- Reviews customer health signals (mocked)
- Forecasts renewal probability + highlights risk drivers
- Generates a clear, executive-style retention action plan

## Quick start

### 1) Set environment variables
Create a `.env.local` file in the project root:

TAVUS_API_KEY=your_api_key_here
TAVUS_REPLICA_ID=your_replica_id_here
TAVUS_PERSONA_ID=your_persona_id_here

### 2) Install and run
npm install
npm run dev

### 3) Demo Flow

Once the video loads, ask the agent to review a customer (e.g., “Acme”).
The agent will:

1. Summarize key health signals
2. Estimate renewal probability
3. Recommend prioritized retention actions


## Architecture (high level)

### Frontend (Next.js App Router)
app/page.tsx
- Creates a conversation via /api/create-conversation
- Stores conversationUrl
- Renders the video UI

### Backend (Next.js API route)
app/api/create-conversation/route.ts
- Validates env vars
- Calls Tavus API to create a conversation
- Returns conversation_url

### CVI Video UI (Daily.co under the hood)
app/components/cvi/components/conversation/index.tsx
- Joins the Daily room using the Tavus conversationUrl
- Handles device selection (mic/camera)
- Lets the user leave/restart

### Retention logic + mock data
lib/tools.ts
- Renewal forecast + strategy generation logic

lib/mockAccounts.json
- Sample account health metrics used for demos

Note: In a production setting, these metrics would be pulled from systems like CRM (Salesforce/Gainsight), product analytics (Amplitude/Mixpanel), and support (Zendesk/Intercom). This prototype uses mock data to demonstrate the workflow.