const bcrypt = require("bcrypt");

function isValidEmail(email) {
  // use a regular expression to verify the email format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function isMatchingPasswords(password1, password2) {
  return password1 === password2;
}

module.exports = { isValidEmail, isMatchingPasswords };
