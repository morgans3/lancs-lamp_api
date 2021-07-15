// @ts-check

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const credentials = require("../_credentials/credentials");
const User = require("../models/user");
const organisations = require("./activedirectory").organisations;

module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = credentials.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      switch (jwt_payload.authentication) {
        case "Owned":
          User.getUserByUsername(jwt_payload.username, (err, user) => {
            if (err) {
              return done(err, false);
            }
            if (user) {
              return done(null, jwt_payload);
            } else {
              return done(null, false);
            }
          });
          break;
        default:
          // Active Directory
          const myOrg = organisations.find((x) => x.name === jwt_payload.authentication);
          myOrg.org.findUser({}, jwt_payload.username, false, function (err, user) {
            if (err) {
              return done(null, false);
            }
            if (user) {
              return done(null, jwt_payload);
            } else {
              return done(null, false);
            }
          });
          break;
      }
    })
  );
};
