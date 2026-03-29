# JanSahaay System Workflow - Complete Example

## Executive Summary
This document shows a **complete end-to-end journey** of a citizen filing an RTI request through the JanSahaay platform, with actual data structures, API calls, database updates, and expected timings.

---

## 🎯 Real World Scenario
**Citizen**: Raj Patel  
**Issue**: "I filed a Right to Information request with the Municipal Water Supply Department for records on water contamination complaints in my area. I don't know how to write it formally."  
**Expected Outcome**: A legally compliant, formatted PDF RTI letter ready to submit.

---

## 📊 Complete Request Journey

### **Phase 1: Frontend - User Input (0-30 seconds)**

#### Step 1.1 - User Visits Application
```
URL: https://jansahaay.in
→ React loads (Vite bundled ~150KB)
→ Axios interceptor attached
→ Supabase auth checked
→ Redirected to /dashboard (if authenticated)
```

#### Step 1.2 - User Fills Form
```text
Form Component: MultiStepWizard.jsx
├── Step 1: Issue Description
│   └── Input: "No reply from Municipal Water Dept for supply records"
│
├── Step 2: Personal Details
│   ├── Name: "Raj Patel"
│   ├── Email: "raj@example.com"
│   ├── Phone: "+91-9876543210"
│   └── Address: "123 Green Lane, Mumbai 400001"
│
└── Step 3: Attachments (Optional)
    ├── Screenshots: [water_damage.jpg, notice.pdf]
    └── Previous Correspondence: [email_1.eml, email_2.eml]
```

#### Step 1.3 - Frontend API Call
```javascript
// Axios POST request
POST https://jansahaay.in/api/v1/rti/submit
Headers:
  Authorization: Bearer <supabase_jwt_token>
  Content-Type: application/json

Body:
{
  "user_id": "user_uuid_12345",
  "issue_text": "No reply from Municipal Water Dept for supply records",
  "issue_category": "water_supply",
  "details": {
    "name": "Raj Patel",
    "email": "raj@example.com",
    "phone": "+91-9876543210",
    "address": "123 Green Lane, Mumbai 400001"
  },
  "attachments": [
    {
      "filename": "water_damage.jpg",
      "size_bytes": 2500000,
      "mime_type": "image/jpeg",
      "base64_data": "..."
    }
  ],
  "consent_given": true
}

Response Time: ~100ms (network + validation)
```

---

### **Phase 2: Backend - Request Reception & Classification (0.5-1 second)**

#### Step 2.1 - API Endpoint Receives Request
```
Endpoint: POST /api/v1/rti/submit
FastAPI Handler: routes/rti.py::submit_rti_request()

Actions:
├── Verify JWT token with Supabase public key ✓
├── Validate request schema (Pydantic) ✓
├── Check rate limit (user can submit 5/day) ✓
└── Parse form data and extract text
```

#### Step 2.2 - Save Initial Request Record (Draft)
```sql
INSERT INTO requests (
  user_id,
  type,
  status,
  category,
  original_text,
  created_at,
  updated_at
) VALUES (
  'user_uuid_12345',
  'INFORMATION_REQUEST',
  'DRAFT',
  'water_supply',
  'No reply from Municipal Water Dept for supply records',
  NOW(),
  NOW()
)
RETURNING id, created_at;

-- Response:
-- id: "req_uuid_67890"
-- created_at: "2026-03-29T14:32:15Z"
```

#### Step 2.3 - Call AI Classifier (8B-instant)
```
Service: modules/ai/classification_service.py
Model: llama-3.1-8b-instant
Input Tokens: ~150
Output Tokens: ~50
Processing Time: ~50ms

Prompt:
"""
Classify this citizen query into one of three types:
1. Information_Request (RTI under RTI Act 2005)
2. Complaint (about government service)
3. Grievance (redressal request)

Query: "No reply from Municipal Water Dept for supply records"

Respond with JSON: {type: "...", confidence: 0.0-1.0, reasoning: "..."}
"""

Response:
{
  "type": "Information_Request",
  "confidence": 0.98,
  "reasoning": "User is asking for information/records, fits RTI definition",
  "input_tokens": 145,
  "output_tokens": 48,
  "latency_ms": 52
}
```

#### Step 2.4 - Update Request Type in Database
```sql
UPDATE requests 
SET type = 'INFORMATION_REQUEST'
WHERE id = 'req_uuid_67890';
```

---

### **Phase 3: Backend - Department & Jurisdiction Detection (1-2 seconds)**

#### Step 3.1 - Call AI Department Detector (8B-instant)
```
Service: modules/ai/department_service.py
Model: llama-3.1-8b-instant
Input Tokens: ~200
Output Tokens: ~100
Processing Time: ~80ms

Prompt:
"""
Identify the government department and jurisdiction from this query:

Query: "No reply from Municipal Water Dept for supply records"

Respond with JSON:
{
  "department_name": "...",
  "state": "...",
  "level": "Central|State|Municipal",
  "contact_method": "email|post|online",
  "statutory_deadline_days": 30,
  "confidence": 0.0-1.0
}
"""

Response:
{
  "department_name": "Municipal Water Supply Department",
  "state": "Maharashtra",
  "level": "Municipal",
  "contact_method": "email",
  "statutory_deadline_days": 30,
  "confidence": 0.96
}
```

#### Step 3.2 - Find or Create Department Record
```sql
-- Check if department exists
SELECT id FROM departments 
WHERE name = 'Municipal Water Supply Department'
AND state = 'Maharashtra';

-- If not found, create it
INSERT INTO departments (name, state, level, max_response_days, created_at)
VALUES (
  'Municipal Water Supply Department',
  'Maharashtra',
  'Municipal',
  30,
  NOW()
)
RETURNING id;

-- Result: dept_id = "dept_uuid_11111"
```

#### Step 3.3 - Link Request to Department
```sql
INSERT INTO request_department_mappings (
  request_id,
  department_id,
  reason,
  confidence
) VALUES (
  'req_uuid_67890',
  'dept_uuid_11111',
  'water_supply_query',
  0.96
);
```

---

### **Phase 4: Backend - AI Draft Generation (2-5 seconds)**

#### Step 4.1 - Prepare Drafting Context
```
Groq 128k context window allows us to include:
├── User issue text (150 tokens)
├── Department metadata (50 tokens)
├── RTI Act 2005 relevant sections (1000 tokens)
├── Legal template (500 tokens)
└── Examples of compliant RTI requests (1500 tokens)
Total context: ~3200 tokens loaded
```

#### Step 4.2 - Call AI Drafter (70B-versatile)
```
Service: modules/ai/draft_service.py
Model: llama-3.1-70b-versatile
Input Tokens: ~3200
Output Tokens: ~800
Processing Time: ~1500ms

Prompt:
"""
You are a legal AI assistant specialized in RTI (Right to Information) requests 
in India, compliant with the RTI Act 2005.

User Query: No reply from Municipal Water Dept for supply records

Department: Municipal Water Supply Department, Maharashtra

Generate a formally compliant RTI request letter with these sections:
1. Applicant Details (Name, Address, Contact)
2. Authority Name and Address
3. Facts and Issues (2-3 paragraphs)
4. Specific Information Requested (numbered list)
5. Section 6(1) Reference
6. Delivery Method Preference
7. Authorization and Signature Block

Format: Formal letterhead style, numbered sections, dates.
Include all mandatory compliance elements per RTI Act 2005.
"""

Response:
{
  "draft_content": "Raj Patel\n123 Green Lane...\n\nDated: 29-03-2026\n\n..."
  "sections": {
    "applicant": {...},
    "authority": {...},
    "facts": "...",
    "information_requested": [
      "Details of all water contamination complaints...",
      "Remedial actions taken by the department...",
      "Timeline of responses..."
    ],
    "legal_references": ["RTI Act 2005, Section 6(1)", "Section 12 - Process"],
    "timeline_expectation": "30 days per statutory requirement"
  },
  "word_count": 380,
  "input_tokens": 3245,
  "output_tokens": 782,
  "latency_ms": 1523
}
```

---

### **Phase 5: Backend - Validation & PII Check (0.5 seconds)**

#### Step 5.1 - Content Validation
```python
# modules/ai/validation_service.py

Checks:
✓ Contains required sections? (applicant, authority, facts, questions)
✓ Legal references present? (Section 6(1))
✓ Formal tone? (Not angry/abusive language)
✓ Phone number format valid? (9876543210)
✓ Email format valid? (raj@example.com)
✓ Address parseable?
✓ Spell check passed?

Result: VALID (all checks passed)
```

#### Step 5.2 - PII Sanitization
```
PII Detection Engine Results:
├── Phone Number: "+91-9876543210" → Found (KEEP - explicit user data)
├── Email: "raj@example.com" → Found (KEEP - explicit user data)
├── Address: "123 Green Lane" → Found (KEEP - user provided)
├── Aadhaar: Not found ✓
├── Bank Account: Not found ✓
└── No sensitive extracted PII detected ✓

Status: PDF can be generated (no sensitive data stripped)
```

#### Step 5.3 - Compliance Check
```
RTI Act 2005 Compliance Checklist:
✓ Section 6(1) cited
✓ Applicant identification present
✓ Authority correctly identified
✓ Request is specific (not fishing)
✓ Information not excluded under Section 8/9
✓ Signature block present
✓ Delivery method specified

Compliance Score: 98%
Status: READY FOR PDF GENERATION
```

---

### **Phase 6: Backend - PDF Generation (0.5 seconds)**

#### Step 6.1 - ReportLab PDF Creation
```python
# modules/document/pdf_service.py::generate_rti_pdf()

ReportLab Process:
├── Create PDF canvas (A4, 210x297mm)
├── Add header (JanSahaay logo, RTI request stamp)
├── Format applicant block (name, address, date)
├── Format authority block
├── Render body text with proper margins
├── Add footer (RTI docket number, page numbers)
├── Insert signature block
├── Embed metadata (title, author, subject)
└── Save to bytes buffer

Output:
{
  "pdf_bytes": b"PDF_BINARY_DATA_HERE",
  "file_size_bytes": 145230,
  "page_count": 2,
  "creation_time_ms": 245,
  "metadata": {
    "title": "RTI Request - Water Supply Records",
    "creator": "JanSahaay v1.0",
    "creation_date": "2026-03-29T14:32:47Z"
  }
}
```

#### Step 6.2 - Store PDF in Supabase Storage
```
Supabase Storage API Call:
PUT /storage/v1/object/rti/2026/req_uuid_67890.pdf

File Path: /rti/2026/req_uuid_67890.pdf
File Size: 145.23 KB
MIME Type: application/pdf
Access: private (user-only, via signed URL)

Response:
{
  "name": "req_uuid_67890.pdf",
  "id": "rti_file_uuid_22222",
  "created_at": "2026-03-29T14:32:48Z",
  "updated_at": "2026-03-29T14:32:48Z",
  "last_accessed_at": null,
  "metadata": {
    "eTag": "e1a2b3c4",
    "size": 145230
  }
}

Public URL (signed, 7-day expiry):
https://sahaay.supabase.co/storage/v1/object/sign/rti/2026/req_uuid_67890.pdf?...
```

---

### **Phase 7: Backend - Database Finalization (0.2 seconds)**

#### Step 7.1 - Save Document Record
```sql
INSERT INTO documents (
  request_id,
  document_type,
  pdf_url,
  page_count,
  word_count,
  token_count,
  model_used,
  status,
  created_at
) VALUES (
  'req_uuid_67890',
  'INFORMATION_REQUEST',
  'https://sahaay.supabase.co/storage/v1/object/sign/rti/2026/req_uuid_67890.pdf?...',
  2,
  380,
  4000,
  'llama-3.1-70b-versatile',
  'FINAL',
  NOW()
)
RETURNING id;

-- Result: doc_id = "doc_uuid_33333"
```

#### Step 7.2 - Update Request Status
```sql
UPDATE requests 
SET 
  status = 'COMPLETED',
  updated_at = NOW()
WHERE id = 'req_uuid_67890';
```

#### Step 7.3 - Log Audit Trail
```sql
INSERT INTO audit_log (
  request_id,
  action,
  actor,
  details,
  timestamp
) VALUES (
  'req_uuid_67890',
  'RTI_GENERATED',
  'system',
  '{"model": "llama-3.1-70b", "latency_ms": 1523, "tokens": 4000}',
  NOW()
);
```

---

### **Phase 8: Backend - Notification Service (Async)**

#### Step 8.1 - Send Confirmation Email
```
Email Service: modules/utils/emails.py

To: raj@example.com
Subject: Your RTI Request is Ready - JanSahaay

Body:
---
Dear Raj Patel,

Your RTI request has been successfully generated and is ready for submission.

Request ID: req_uuid_67890
Document Type: Information Request
Department: Municipal Water Supply Department, Maharashtra
Generated: 29-Mar-2026 14:32:47 IST
Status: READY FOR SUBMISSION

📎 Download Your RTI Letter:
[Click here to download PDF]

⏱️ Statutory Deadline: Department must respond within 30 days

Next Steps:
1. Download and review the attached RTI letter
2. Print it (or save as PDF)
3. Submit to: water-dept@mumbai.gov.in
   OR
   Postal Address: [Department Address from database]

Questions? Visit our FAQ or contact support.

Best regards,
JanSahaay Team
```

Response Info:
- Sent via SendGrid API
- Delivery Status: Queued
- Tracking: Email ID "email_uuid_44444"

#### Step 8.2 - Update User Dashboard
```
Webhook/Event Published:
EVENT: request.completed
Payload:
{
  "request_id": "req_uuid_67890",
  "user_id": "user_uuid_12345",
  "status": "COMPLETED",
  "document_count": 1,
  "pdf_url": "...",
  "timestamp": "2026-03-29T14:32:50Z"
}

Frontend React Hook (useEffect) receives event:
→ Refetch user's requests list
→ Show success toast (Sonner)
→ Navigate to document view
```

---

### **Phase 9: Frontend - Display Results (Instant)**

#### Step 9.1 - API Response to Frontend
```json
{
  "status": "success",
  "message": "RTI request generated successfully",
  "data": {
    "request_id": "req_uuid_67890",
    "document_id": "doc_uuid_33333",
    "pdf_url": "https://sahaay.supabase.co/...",
    "document_type": "INFORMATION_REQUEST",
    "department": {
      "name": "Municipal Water Supply Department",
      "state": "Maharashtra",
      "response_days": 30
    },
    "metadata": {
      "page_count": 2,
      "word_count": 380,
      "generated_at": "2026-03-29T14:32:50Z",
      "model_used": "llama-3.1-70b-versatile"
    }
  }
}
```

#### Step 9.2 - Frontend Renders Success View
```jsx
// pages/ResultPage.jsx

Display:
├── 🎉 Success Banner
│   └── "Your RTI request is ready!"
│
├── Document Preview
│   ├── Preview of the drafted letter
│   ├── Page 1 of 2 shown
│   └── [View Full Document]
│
├── Action Buttons
│   ├── [📥 Download PDF]
│   ├── [📧 Email to Myself]
│   ├── [📋 Copy Text]
│   └── [✏️ Edit & Regenerate]
│
├── Department Info Card
│   ├── Authority: Municipal Water Supply Department
│   ├── Jurisdiction: Municipal, Maharashtra
│   ├── Response Deadline: 30 days
│   └── Submit To: water-dept@mumbai.gov.in
│
└── Next Steps Guide
    ├── 1. Download the PDF
    ├── 2. Print or email to department
    └── 3. Track response in History
```

---

## 📊 Complete Timing Breakdown

```
Phase 1 (Frontend Input)          :    0-30s   (user action)
Phase 2 (Classification)          :    0.5-1s  (AI 8B-instant)
Phase 3 (Department Detection)    :    1-2s    (AI 8B-instant)
Phase 4 (Draft Generation)        :    2-5s    (AI 70B-versatile) ⭐ DOMINANT
Phase 5 (Validation & PII)        :    0.5s    (local rules)
Phase 6 (PDF Generation)          :    0.5s    (ReportLab)
Phase 7 (Database Save)           :    0.2s    (SQL writes)
Phase 8 (Email/Notification)      :    async   (background)
Phase 9 (Frontend Render)         :    instant (React)

TOTAL END-TO-END: ~5-7 seconds (mostly AI latency)
```

---

## 📈 Database State After Completion

### Users Table
```
id               | email               | name       | phone          | created_at
user_uuid_12345  | raj@example.com     | Raj Patel  | +91-9876543210 | 2026-03-28T10:00:00Z
```

### Requests Table
```
id              | user_id            | type                  | status    | category      | created_at
req_uuid_67890  | user_uuid_12345    | INFORMATION_REQUEST   | COMPLETED | water_supply  | 2026-03-29T14:32:15Z
```

### Documents Table
```
id              | request_id         | document_type         | pdf_url    | page_count | token_count | model_used
doc_uuid_33333  | req_uuid_67890     | INFORMATION_REQUEST   | https://... | 2        | 4000       | llama-3.1-70b-versatile
```

### Departments Table
```
id             | name                            | state         | level      | max_response_days
dept_uuid_11111| Municipal Water Supply Dept     | Maharashtra   | Municipal  | 30
```

### Request-Department Mappings Table
```
id     | request_id     | department_id  | confidence
map_1  | req_uuid_67890 | dept_uuid_11111| 0.96
```

### Audit Log Table
```
id        | request_id     | action           | actor  | timestamp
audit_1   | req_uuid_67890 | RTI_GENERATED    | system | 2026-03-29T14:32:50Z
```

---

## 🔐 Security & Privacy Journey

```
✓ Step 1: User Enters Data
  → LocalStorage has JWT (Supabase auth)

✓ Step 2: Frontend Sends to Backend
  → HTTPS encryption in transit
  → JWT token in Authorization header

✓ Step 3: Backend Validates Token
  → Verify against Supabase public key
  → Check user_id matches JWT claim
  → Verify consent flag is TRUE

✓ Step 4: PII Sanitization
  → Phone/Email: Kept (user-provided)
  → Aadhaar/Bank: Not present (checked anyway)
  → Address: Kept (necessary for RTI)

✓ Step 5: PDF Generated & Stored
  → PDF stored in Supabase Storage (private)
  → Signed URL generated (7-day expiry)
  → Access logged in audit_log

✓ Step 6: Email Sent
  → SendGrid with TLS encryption
  → PDF attached via signed URL
  → User can download for 7 days

✓ Step 7: User Downloads
  → Supabase validates signed URL
  → Download logged in audit_log
  → User gets their PDF locally
```

---

## 5️⃣ Alternative Paths / Error Handling

### Scenario A: Failed Classification
```
If llama-3.1-8b returns confidence < 0.70:
├── Retry with different prompt
├── If still low confidence, ask user to select manually
└── User picks: Information_Request / Complaint / Grievance
```

### Scenario B: Unknown Department
```
If no department match found:
├── Suggest top 3 departmental matches from database
├── Let user select from list
└── Or enter department name manually
```

### Scenario C: Groq Timeout
```
If llama-3.1-70b takes >5 seconds:
├── Return partial draft from 8B model
├── Show "Draft Preview (AI-generated)"
├── Allow user to refine manually
└── Queue for full 70B regeneration
```

### Scenario D: PII Detected in PDF
```
If high-confidence sensitive data found:
├── Flag document for manual review
├── Notify user: "Document contains sensitive info"
├── Ask user to remove/redact manually
└── Regenerate PDF after confirmation
```

---

## 🚀 Expected Metrics

```
Metric                           | Target        | Actual (Example)
---------------------------------|----------------|------------------
End-to-End Latency              | <10s           | 5.2s
Classification Latency          | <200ms         | 52ms ✓
Department Detection Latency    | <200ms         | 80ms ✓
Draft Generation Latency        | <2s            | 1.523s ✓
PDF Generation Latency          | <500ms         | 245ms ✓
Database Write Latency          | <50ms          | 18ms ✓
Email Delivery Time             | <5min          | async
User Success Rate               | >95%           | 98% (validation passes)
PII False Positive Rate         | <1%            | 0%
Cost per RTI Generated          | <$0.02         | $0.015 (Groq tokens)
```

---

## 📱 Mobile Experience

```
Same workflow works on mobile:
├── Responsive form on iOS/Android
├── Still <10s total latency
├── PDF downloads to device storage
├── Email confirmation sent
└── Can open from email later
```

---

## Next Steps

1. **Implement Phase 1-3** (Form → Classification → Department)
2. **Test with 100 sample user queries** to validate AI accuracy
3. **Build Phase 4-6** (Drafting → Validation → PDF)
4. **Load test** with 50 concurrent requests
5. **Security audit** of authentication & PII handling
6. **Beta launch** with 1000 users
7. **Monitor metrics** and iterate on AI prompts
