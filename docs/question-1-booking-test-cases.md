# Q1 – Booking Flow Test Cases

# Ranked Test Cases (Most → Least Critical)

### 1. TC-01 — Payment succeeds but booking is not confirmed/created
Risk: Financial & Booking Integrity
Description: Payment is successfully captured but no booking record is created in the system.

### 2. TC-02 — Booking is confirmed but payment is not captured
Risk: Revenue Integrity
Description: Booking is confirmed but payment is not successfully captured, creating service obligation without revenue.

### 3. TC-03 — Heart CT eligibility gating correctness
Risk: Clinical Safety & Booking Integrity
Description: Eligibility logic must correctly block contraindicated Heart CT bookings, both standalone and as add-ons. Disqualification must remove the add-on and update total correctly.

### 4. TC-04 — Duplicate submission protection
Risk: Booking Integrity
Description: Duplicate submissions (refresh, retry, double-click) must not create duplicate bookings or multiple payment captures.

### 5. TC-05 — End-to-end happy path booking + card payment success
Risk: Financial & Booking Integrity
Description: Baseline confirmation that the primary booking + card payment flow completes successfully before edge case validation.

### 6. TC-06 — Heart CT eligibility does not persist incorrectly across sessions
Risk: Clinical Safety & Booking Integrity
Description: Prior eligibility responses must not persist in a way that bypasses re-evaluation in a new session.

### 7. TC-07 — Amount charged matches pre-payment summary
Risk: Pricing Integrity
Description: The amount displayed in the pre-payment summary must match the amount captured by the payment processor.

### 8. TC-08 — Payment decline handling
Risk: Payment & Booking Integrity
Description: Declined payment must not create booking confirmation. User must receive clear error and be able to retry without duplicate records.

### 9. TC-09 — Affirm redirect flow integrity
Risk: Payment State Integrity & Booking Integrity
Description: Third-party redirect (Affirm approval/denial) must return to a consistent booking state without orphaned bookings or duplicate payment intents.

### 10. TC-10 — Promo code integrity including payment-method switching
Risk: Pricing Integrity
Description: Promo must not double-apply, persist incorrectly, or reset when switching payment methods.

### 11. TC-11 — Google Pay + bank transfer flow integrity
Risk: Payment & Booking Integrity
Description: Alternative payment methods must complete without creating inconsistent booking or payment state.

### 12. TC-12 — Clinic–package incompatibility blocked with clear recovery
Risk: Booking Integrity
Description: User is notified if the clinic that is selected does not offer the package type that the user selected. This gates the user from booking an incorrect appointment.

### 13. TC-13 — Time-slot rule enforcement 
Risk: Booking Integrity
Description: Booking progression is gated until the required time slots are selected, preventing invalid scheduling payloads.

### 14. TC-14 — Back-navigation resets derived state correctly
Risk: Booking Integrity
Description: Changing selections when navigating backward must correctly reset derived state (pricing, eligibility flags, slot validity) to prevent stale data on summary.

### 15. TC-15 — Payment error handling does not leak internal/provider details
Risk: Security / Information Disclosure
Description: Payment error surfaces must not expose internal system identifiers, raw provider payloads, or debugging details.

---

### Top 3 Justification

The top three cases represent the highest-severity failures in the booking flow.

The first two focus on payment and booking state consistency. Payment capture and booking creation are separate operations. If one succeeds and the other fails, the system becomes inconsistent, and we end up either charging a user without a booking record, or creating a booking without capturing payment. Both outcomes require manual reconciliation and directly impact financial integrity and user confidence. Because they represent irreversible state mismatches, they are ranked highest.

The third case focuses on Heart CT eligibility gating. As a healthcare platform, preventing contraindicated scans is critical. If eligibility logic fails, a user could book a scan that is not appropriate for them. Unlike financial errors, which can be refunded, patient safety risks are not easily reversible. For that reason, clinical gating ranks immediately after financial state integrity failures.

---

# Test Strategy/Prioritization Logic

I began with exploratory testing to understand the booking flow, state transitions, and enforcement logic across each step. From that exploration, I identified the primary risk categories within this flow:

- Financial Integrity

- Clinical Safety

- Booking Integrity

- Payment State Integrity

- Security / Information Disclosure

Prioritization was driven first by severity of impact, then by likelihood and frequency.

For a healthcare platform, clinical safety and financial integrity carry the highest consequence. A contraindicated scan booking or a mismatched payment/booking state introduces immediate regulatory, operational, and trust implications. These risks were ranked highest.

Payment method variants, booking constraint enforcement, and navigation/state mutation cases were ranked lower because they either affect subsets of users or are gated earlier in the flow, reducing the likelihood of catastrophic system impact.

Throughout ranking, I prioritized irreversible failures (e.g., incorrect charges, contraindicated scans, inconsistent booking/payment state) above operational friction or UX-level constraints.

---

# Assumptions & Environment Constraints

All test cases were derived by exploring stage functionality. Test cases might not all be testable through the ui and may require additional tooling and control of the backend system especially those cases related to payment. Some additional assumptions and constraints:

- Staging environment may not reflect production behavior
- No known valid promo codes in staging
- Sandbox payment provider behavior may differ in production
- Limited system-of-record visibility. Admin portal confirms booking exists, but payment amount/processor capture not visible

## Scope

This set covers the first three steps of the booking flow including payment:

Login/Auth → Package & Add-on Selection → Clinic & Time Selection → Pre-payment Summary → Payment.

Post-booking medical questionnaire is excluded from this set.

---