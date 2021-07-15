// @ts-check

const credentials = require("../_credentials/credentials");
const Request = require("request");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
let returnUser, token, options, tokenA, tempUser;
const access = process.env.AWSPROFILE || "Dev";
const organisations = require("../config/activedirectory").organisations;

const usernameADLogin = function (username, password, organisation, authentication, activedirectory, filter, callback) {
  activedirectory.findUser(username, function (err, user) {
    if (err) {
      callback(true, JSON.stringify(err));
      console.log(username + " ERROR: " + JSON.stringify(err));
      return;
    }
    if (!user) {
      callback(true, "ERROR: " + "User: " + username + " has not been found.");
      console.log(username + " ERROR: user not found");
      return;
    } else {
      activedirectory.authenticate(user.userPrincipalName, password, function (err, auth) {
        if (err) {
          callback(true, "ERROR: " + JSON.stringify(err));
          console.log(username + " ERROR: " + JSON.stringify(err));
          return;
        }
        if (auth) {
          let memberships = [];
          returnUser = {
            _id: sidBufferToString(user.objectSid),
            name: user.cn,
            username: user.sAMAccountName,
            email: user.mail,
            organisation: organisation,
            authentication: authentication,
            memberships: memberships,
          };
          token = jwt.sign(returnUser, credentials.secret, {
            expiresIn: 604800, //1 week
          });
          callback(null, token);
        } else {
          callback(true, "Wrong Password");
          console.log(username + " ERROR: wrong password");
          return;
        }
      });
    }
  });
};

module.exports.loginUsername = function (authentication, username, password, organisation, callback) {
  switch (authentication) {
    case "Demo":
      User.getUserByUsername(username, (err, data) => {
        if (err) {
          callback(true, err);
          return;
        }
        var user;
        if (data.Items) {
          user = data.Items[0];
        }
        if (!user) {
          callback(true, "User not found");
          return;
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) {
            callback(true, err);
            return;
          }
          if (isMatch) {
            let memberships = [];

            const id = user._id || user.username + "_" + organisation;
            returnUser = {
              _id: id,
              name: user.name,
              username: user.username,
              email: user.email,
              organisation: organisation,
              authentication: authentication,
              memberships: memberships,
            };
            token = jwt.sign(returnUser, credentials.secret, {
              expiresIn: 604800, //1 week
            });
            callback(null, token);
            return;
          } else {
            callback(true, "Wrong Password");
            return;
          }
        });
      });
      break;
    default:
      const activedirectory = organisations.find((x) => x.name == authentication);
      if (activedirectory) {
        usernameADLogin(username, password, organisation, authentication, activedirectory.org, null, (err, res) => {
          if (err) {
            callback(true, err);
            return;
          } else {
            callback(null, res);
            return;
          }
        });
      } else {
        callback(true, "Unknown Organisation");
      }
      break;
  }
};

const emailADLogin = function (username, password, organisation, authentication, activedirectory, filter, callback) {
  const personquery = "(&(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group)))";
  const emailquery = "(mail=" + username + ")";
  const fullquery = "(&" + emailquery + personquery + ")";
  activedirectory.findUsers(fullquery, function (err, user) {
    if (err) {
      callback(true, JSON.stringify(err));
      console.log(username + " ERROR: " + JSON.stringify(err));
      return;
    }
    let filteredUsers = user;
    if (filter && (!filteredUsers || filteredUsers.length == 0)) {
      filteredUsers = user.filter((u) => u.distinguishedName.indexOf(filter) > -1);
    }
    if (!filteredUsers || filteredUsers.length == 0) {
      callback(true, "User: " + username + " not found.");
      console.log(username + " ERROR: user not found");
      return;
    } else {
      activedirectory.authenticate(user[0].userPrincipalName, password, function (error, auth) {
        if (error) {
          callback(true, JSON.stringify(error));
          console.log(username + " ERROR: " + JSON.stringify(error));
          return;
        }
        if (auth) {
          let subdomain = "";
          if (access === "Dev") {
            subdomain = "dev.";
          } else if (access === "Test") {
            subdomain === "demo.";
          }
          tempUser = {
            _id: sidBufferToString(user[0].objectSid),
            name: user[0].cn,
            username: user[0].sAMAccountName,
            email: user[0].mail,
            organisation: organisation,
            authentication: authentication,
          };
          tokenA = jwt.sign(tempUser, credentials.secret, {
            expiresIn: 604800, //1 week
          });
          options = {
            headers: {
              authorization: "JWT " + tokenA,
            },
          };
          try {
            Request.get("https://usergroup." + subdomain + "nexusintelligencenw.nhs.uk" + "/teammembers/getTeamMembershipsByUsername?username=" + user[0].sAMAccountName, options, (error, response, body) => {
              if (error) {
                callback(true, "Error checking memberships, reason: " + error);
                console.log(username + " ERROR Memberships: " + JSON.stringify(error));
                return;
              }
              let memberships = [];
              try {
                if (body) {
                  memberships = JSON.parse(body);
                }
              } catch (ex) {}
              returnUser = {
                _id: sidBufferToString(user[0].objectSid),
                name: user[0].cn,
                username: user[0].sAMAccountName,
                email: user[0].mail,
                organisation: organisation,
                authentication: authentication,
                memberships: memberships,
              };
              token = jwt.sign(returnUser, credentials.secret, {
                expiresIn: 604800, //1 week
              });
              callback(null, token);
              return;
            });
          } catch (error) {
            callback(true, error.toString());
            console.log(username + " ERROR Memberships: " + JSON.stringify(error.toString()));
            return;
          }
        } else {
          callback(true, "Wrong Password");
          console.log(username + " ERROR: wrong password");
          return;
        }
      });
    }
  });
};

module.exports.loginEmail = function (authentication, email, password, organisation, callback) {
  switch (authentication) {
    case "Demo":
      User.getUserByEmail(email, (err, data) => {
        if (err) {
          callback(true, err);
          return;
        }
        if (data === null) {
          callback(true, "Email not found");
        }
        var user;
        if (data.Items) {
          user = data.Items[0];
        }
        if (!user) {
          callback(true, "Email not found");
          return;
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) {
            callback(true, err);
            return;
          }
          if (isMatch) {
            tokenA = jwt.sign(JSON.parse(JSON.stringify(user)), credentials.secret, {
              expiresIn: 604800, //1 week
            });
            options = {
              headers: {
                authorization: "JWT " + tokenA,
              },
            };
            let memberships = [];

            const id = user._id || user.username + "_" + organisation;
            returnUser = {
              _id: id,
              name: user.name,
              username: user.username,
              email: user.email,
              organisation: organisation,
              authentication: authentication,
              memberships: memberships,
            };
            token = jwt.sign(returnUser, credentials.secret, {
              expiresIn: 604800, //1 week
            });
            callback(null, token);
            return;
          } else {
            callback(true, "Wrong Password");
            return;
          }
        });
      });
      break;
    default:
      const activedirectory = organisations.find((x) => x.name == authentication);
      if (activedirectory) {
        emailADLogin(email, password, organisation, authentication, activedirectory.org, null, (err, res) => {
          if (err) {
            callback(true, err);
            return;
          } else {
            callback(null, res);
            return;
          }
        });
      } else {
        callback(true, "Unknown Organisation");
      }
      break;
  }
};

let pad = function (s) {
  if (s.length < 2) {
    return `0${s}`;
  } else {
    return s;
  }
};

let sidBufferToString = function (buf) {
  let asc, end;
  let i;
  if (buf == null) {
    return null;
  }

  let version = buf[0];
  let subAuthorityCount = buf[1];
  let identifierAuthority = parseInt(
    (() => {
      let result = [];
      for (i = 2; i <= 7; i++) {
        result.push(buf[i].toString(16));
      }
      return result;
    })().join(""),
    16
  );

  let sidString = `S-${version}-${identifierAuthority}`;

  for (i = 0, end = subAuthorityCount - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    let subAuthOffset = i * 4;
    let tmp = pad(buf[11 + subAuthOffset].toString(16)) + pad(buf[10 + subAuthOffset].toString(16)) + pad(buf[9 + subAuthOffset].toString(16)) + pad(buf[8 + subAuthOffset].toString(16));
    sidString += `-${parseInt(tmp, 16)}`;
  }

  return sidString;
};
