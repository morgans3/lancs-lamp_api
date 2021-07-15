// @ts-check

const bcrypt = require("bcryptjs");
const AWS = require("../config/database").AWS;
const tablename = "users";

module.exports.getUserByUsername = function (username, callback) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: tablename,
    KeyConditionExpression: "#username = :username",
    ProjectionExpression: "#username, #name, #email, #password, #organisation, #linemanager",
    ExpressionAttributeNames: {
      "#username": "username",
      "#email": "email",
      "#name": "name",
      "#password": "password",
      "#organisation": "organisation",
      "#linemanager": "linemanager",
    },
    ExpressionAttributeValues: {
      ":username": username,
    },
  };
  docClient.query(params, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: tablename,
    IndexName: "email-index",
    KeyConditionExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  docClient.query(params, callback);
};

module.exports.addUser = function (newUser, password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      newUser["password"] = { S: hash };
      var docClient = new AWS.DynamoDB();
      var params = {
        TableName: "users",
        Item: newUser,
      };
      docClient.putItem(params, callback);
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
