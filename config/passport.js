// @ts-check

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const credentials = require("../_credentials/credentials");
const ActiveDirectory = require("activedirectory");
const LDAP_IP_AND_PORT = process.env.LDAPConnection || "0.0.0.0:80";
const User = require("../models/user");

const userfields = ["manager", "distinguishedName", "userPrincipalName", "sAMAccountName", "mail", "lockoutTime", "whenCreated", "pwdLastSet", "userAccountControl", "employeeID", "sn", "givenName", "initials", "cn", "displayName", "comment", "description", "linemanager", "objectSid"];
const groupfields = ["distinguishedName", "objectCategory", "cn", "description"];
// @ts-ignore
const ExampleAD = new ActiveDirectory({
  url: "ldap://" + LDAP_IP_AND_PORT,
  baseDN: "dc=uk",
  bindDN: credentials.ldapauth,
  bindCredentials: credentials.ldappass,
  attributes: {
    user: userfields,
    group: groupfields,
  },
  entryParser(entry, raw, callback) {
    if (raw.hasOwnProperty("objectGUID")) {
      entry.objectGUID = raw.objectGUID;
    }
    if (raw.hasOwnProperty("objectSid")) {
      entry.objectSid = raw.objectSid;
    }
    callback(entry);
  },
});

const organisations = [{ org: ExampleAD, name: "AuthenticationName" }];

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
