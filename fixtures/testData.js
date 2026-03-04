/**
 * Shared test data constants.
 * All string values marked TODO must be confirmed against the staging UI before use.
 */


const PACKAGES = {
  MRI_SCAN_OPTION: {'testId': 'FB30-encounter-card', 'displayName': 'MRI Scan', "packageId": "2b8f4e9a-7c3d-4a1e-9f5b-6d2c8e4a7b3f"},
  MRI_WITH_SPINE: 'FB60-encounter-card',
  MRI_SKELETAL_NEURO: 'BLUEPRINTNR-encounter-card',
  HEART_CT: 'GATEDCAC-encounter-card',
  LUNGS_CT: 'LUNG-encounter-card',
};


const ADDONS = {
  HEART_CT: 'gatedcac-addon-card',
  LUNG_CT: 'lung-addon-card',
};

/**
 * Stripe test cards — safe for staging use only.
 * Full list: https://stripe.com/docs/testing#cards
 */
const TEST_CARDS = {
  VISA_SUCCESS: {
    number: '4242424242424242',
    expiry: '12/34',
    cvc: '123',
    zip: '10001'
  },
  VISA_DECLINE: {
    number: '4000000000000002',
    expiry: '12/34',
    cvc: '123',
    zip: '10001'
  },
};

/**
 * Heart CT eligibility questionnaire answer maps.
 * Keys should match question identifiers; values should match answer labels.
 * TODO: populate after inspecting the staging eligibility questionnaire.
 *
 * Example shape:
 *   QUALIFYING_ANSWERS: { 'do-you-have-a-pacemaker': 'No', ... }
 *   DISQUALIFYING_ANSWERS: { 'do-you-have-a-pacemaker': 'Yes' }
 */
const HEART_CT_ELIGIBILITY = {
  QUALIFYING_ANSWERS: {
    // TODO
  },
  DISQUALIFYING_ANSWERS: {
    "Do you have any of the following symptoms? Chest pain, shortness of breath, reduced ability to perform activities that involve movement or exercise?": "Yes"
  },
};

module.exports = { PACKAGES, ADDONS, TEST_CARDS, HEART_CT_ELIGIBILITY };
