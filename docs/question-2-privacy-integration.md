### Q2 - Integration Test - Part 1 & 2

## Prerequisites
- Two Accounts Created: Member A & Member B
- Obtain session tokens for Member A (<A_SESSION_TOKEN>) and Member B (<B_SESSION_TOKEN>)
- Obtain Member A's submission id for medical history (<A_SUBMISSION_ID>)

## Test Case - Member B cannot access Member A's medical data

## Step 1 - Authorized Access (Control Case)
- Member A authenticates into the system and receives valid session token
- Member A executes a GET request for the medical questionnaire form using Member A's submission ID:

GET https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/<A_SUBMISSION_ID>/data
Authorization: Bearer <A_SESSION_TOKEN>

Expected:
- Token exchange returns 200 OK
- Questionnaire request returns 200 OK
- Reponse returns questionnaire data for Member A

## Step 2 - Unauthorized Access Attempt
- Member B authenticates into the system and receives valid session token
- Member B attempts to access Member A's medical data, and makes a GET request to the medical data service using Member A's submission ID and Member B's session token:

GET https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/<A_SUBMISSION_ID>/data
Authorization: Bearer <B_SESSION_TOKEN>

Expected:
- Token exchange returns 200 OK
- Questionnaire request returns 403 Forbidden or 404 Not Found
- No questionnaire payload or PHI is returned in response body

## Expected Results
- Backend prevents cross member access to PHI data by enforcing submission level authorization checks

## Q2 - Part 3

Solution: API tests should be organized by service domain so related endpoints are grouped together. For example:

--tests
    --forms
        --formService1.js
        --formService2.js
        --formService3.js
--utility
    --utils.js

Each service file contains the endpoints owned by that service and runs a consistent authorization suite. I would create a utility function in utils.js that handles common authorization checks across all services. This utility would validate:

- Unauthenticated users are rejected (401/403)
- Member B receives 403 or 404 when attempting to access Member A’s data
- Member A successfully accesses their own data

This ensures baseline authorization enforcement across all endpoints while avoiding repetitive test logic. For higher-risk services (medical forms, results, reports, billing), additional integration checks would be added to validate that no PHI is leaked in error responses and that ownership is enforced at a deeper level.

Thought Process

As a healthcare company, data privacy and trust are foundational. With 100+ endpoints transferring sensitive data, we should have strategic and consistent authorization validation across the entire API surface. Applying deep validation logic to every endpoint would significantly increase maintenance cost and framework complexity. Instead, this approach balances:

- Broad coverage across all endpoints (baseline authorization matrix)
- Deeper validation only in high-risk domains

This allows us to reduce code redundancy through reusable utilities while still focusing deeper security testing where exposure would be most impactful.

The tradeoff of this approach is that not every endpoint receives the same depth of testing. While baseline authorization checks provide broad protection, more subtle issues such as partial data leakage or improper filtering could go undetected if not specifically targeted. To mitigate this risk, deeper integration testing is intentionally concentrated in services handling the most sensitive data.

This balance prioritizes both scalability and security without creating an unsustainable test framework.