const bcrypt = require("bcrypt");

export function isValidEmail(email) {
  // use a regular expression to verify the email format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export async function isMatchingPasswords(incomingPassword, savedPassword) {
  return await bcrypt.compare(incomingPassword, savedPassword);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export function needsUpdate(lastUpdateTime) {
  const date1 = new Date(lastUpdateTime);
  const date2 = Date.now();
  const hoursSinceUpdate = Math.ceil(Math.abs(date1 - date2) / 36e5);
  return hoursSinceUpdate >= 12 ? true : false;
}

export async function determineFeedPath(url) {
  const res1 = fetch(url + "/feed");
  const res2 = fetch(url + "/rss.xml");
  const result = await Promise.all([res1, res2]);
  for (let w of result) {
    if (w.ok) {
      return w.url;
    }
  }
  throw new Error("No link was resolved! try again.");
}
