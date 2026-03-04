/**
 * Member credentials loaded from environment variables.
 *
 * Required env vars:
 *   MEMBER_EMAIL    - staging member account email
 *   MEMBER_PASSWORD - staging member account password
 */
const { getEnv } = require('../utils/env');

function getMemberCredentials(member, password) {
  return {
    email: getEnv(member),
    password: getEnv(password),
  };
}

module.exports = { getMemberCredentials };
