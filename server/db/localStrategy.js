const db = require("./db");
const { isMatchingPasswords } = require("./utils");
const LocalStrategy = require("passport-local").Strategy;

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  // function of username, password, done(callback)
  async function (email, password, done) {
    try {
      console.log("Verification function called");

      // look for the user data
      const user = await db.getUserByEmail(email);
      // if user doesn't exist
      if (!user) {
        return done(null, false, { message: "User not found." });
      }
      // if the password isn't correct
      if (!isMatchingPasswords(password, user.password)) {
        return done(null, false, {
          message: "User not found.",
        });
      }
      // if the user is properly authenticated
      return done(null, user);
    } catch (error) {
      // if there is an error
      return done(error);
    }
  }
);

module.exports = { localStrategy };
