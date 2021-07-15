// @ts-check

const ActiveDirectory = require("activedirectory");
const credentials = require("../_credentials/credentials");
const LDAP_IP_AND_PORT = process.env.LDAPConnection || "0.0.0.0:80";
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

module.exports.organisations = [{ org: ExampleAD, name: "AuthenticationName" }];
