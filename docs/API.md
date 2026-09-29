# Recruitment API contract

This is the proposed integration contract implemented by the local mock.
There is no deployed recruitment backend in this project.

The default API base is /api/v1. A single multipart submission keeps the frontend
small. For larger-scale deployment, the service module can be replaced with a
signed-upload flow without changing the question or wizard components.

## GET /institutions

Returns HTTP 200:

    {
      "institutions": [
        { "id": "ug", "name": "University of Ghana", "region": "Greater Accra" }
      ]
    }

The mock returns all 22 records in src/data/institutions.ts. The form uses that
bundled catalogue to stay available immediately, without an initial API dependency.
The real IDs and an authoritative catalogue can replace it at integration time.
The frontend slugs are not asserted to match backend catalogue IDs.

## POST /applications

Request headers:

    Accept: application/json
    Idempotency-Key: <UUID>

The browser sets Content-Type and the multipart boundary automatically.

Multipart fields:

| Field                | Type           | Meaning                           |
| -------------------- | -------------- | --------------------------------- |
| answers              | JSON string    | The 14 answers below              |
| video                | Binary file    | MP4 / MOV / WebM, max 50 MiB      |
| videoDurationSeconds | Decimal string | Browser-read duration; maximum 30 |

Answers object (sample data):

    {
      "fullName": "Ama Sample",
      "institution": "ug",
      "programme": "Economics, Year 3",
      "phone": "050 123 4567",
      "email": "ama@example.com",
      "campusReach": "Legon Hall and Balme Library",
      "motivation": "I would like to help students connect.",
      "experience": "I organised a study group of eight classmates.",
      "availability": "3 hours, Tuesday and Saturday",
      "otherRoles": "",
      "phoneModel": "Samsung A15, Android",
      "paymentAnswer": "My answer to the student's question.",
      "comfortable": "no",
      "honesty": true
    }

otherRoles may be an empty string. comfortable must be yes or no; neither choice
is rejected or auto-scored. honesty must be true. Short text is capped at 200
characters, email at 254, paragraphs at 1,200. Phone validation permits 9–15 digits
with spaces, parentheses, a leading plus and hyphens. Answers are trimmed.
No scoring rules are exposed to applicants.

Successful HTTP 201 response:

    {
      "reference": "ADBOX-2026-123456",
      "receivedAt": "2026-09-29T12:00:00.000Z",
      "mode": "live"
    }

Mock responses instead return mode=mock and a PREVIEW- reference. Receipts are
schema-validated. HTTP mode refuses a mock receipt, and mock mode refuses a live
receipt. A 200 with malformed data does not show a successful application.

| Error                  | Handling                                          |
| ---------------------- | ------------------------------------------------- |
| 409                    | Existing application; contact support for changes |
| 413                    | Video too large; choose a smaller file            |
| 422                    | Review answers/video and retry                    |
| 429                    | Wait before trying again                          |
| 5xx                    | Keep answers and video; allow retry               |
| Network loss / timeout | Keep answers and video; allow retry               |

The request times out after 120 seconds. Duplicate clicks are blocked while
submitting. A retry of an unchanged submission reuses its UUID. Editing an answer
or choosing a different file produces a new UUID. The backend must enforce
idempotency and replay the original receipt for a repeated successful request.
The mock produces a stable reference from the UUID and retains no application.

## Remaining backend work

- Store validated applications durably and issue real application references.
- Revalidate every answer, institution ID, current recruitment status and consent.
- Verify video content, codec, byte size and decoded duration on the server;
  browser MIME and duration values are convenience checks, not trusted evidence.
- Provide protected video storage, upload scanning and authorised reviewer access.
- Define retention/deletion procedures and supply the applicant privacy notice
  before collecting real personal information.
- Enforce the deadline once the closing time in Africa/Accra is agreed.
- Add rate limiting, abuse protection and idempotent application creation.
- Confirm how duplicate email/phone applications and edits should work.
- Configure HTTPS, request-body limits, CORS (if cross-origin) and deployment headers.
- Return explicit receipts and known status codes. No authentication tokens or
  API secrets should be embedded in this public application.

Server authentication, a reviewer dashboard, email notifications and permanent
storage are outside this frontend delivery. This project has not sent emails,
created real applicant accounts or published a live recruitment site.
