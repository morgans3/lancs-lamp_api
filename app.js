// @ts-check

// SETUP
// =============================================================================
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const app = express();
const morgan = require("morgan");
const winston = require("winston");
const CloudWatchTransport = require("winston-aws-cloudwatch");
const jwt = require("jsonwebtoken");

// GLOBAL VARIABLES
// const pathlabs = require("./routes/pathlabs");
// const testcentre = require("./routes/testcentre");
// const componenttypes = require("./routes/component_types");
// const pathways = require("./routes/pathways");
// const lamp90 = require("./routes/lamp90_results");
// const trainingresources = require("./routes/trainingresources");
// const registerstaff = require("./routes/registerstaff");
// const training = require("./routes/training");
// const testrequests = require("./routes/testrequests");
// const staffconsent = require("./routes/staffconsent");
// const results = require("./routes/results");
// const pathway_data = require("./routes/pathway_data");
// const lamp90reminders = require("./routes/lamp90_reminders");
// const orgstructures = require("./routes/orgstructures");
// const lists = require("./routes/lists");
// const staffarea = require("./routes/staffarea");
// const orgacknowledgements = require("./routes/orgacknowledgements");
// const labdata = require("./routes/labdata");

// SWAGGER SETUP
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = {
  basePath: "/",
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
};
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};
// @ts-ignore
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ERROR LOGGER SETUP
morgan.token("token", function (req) {
  if (req.headers.authorization) {
    return JSON.stringify(jwt.decode(req.headers.authorization.replace("JWT ", "")));
  } else {
    return "{}";
  }
});
const addAppNameFormat = winston.format((info) => {
  info.appName = "API";
  return info;
});
const parseMessage = function (message) {
  const variables = message.split("|");
  const token = JSON.parse(variables[6]);
  let username = "";
  if (token && token.username) username = token.username;
  let organisation = "";
  if (token && token.organisation) organisation = token.organisation;
  return {
    method: variables[0],
    url: variables[1],
    status: variables[2],
    response: variables[3],
    responsetime: variables[4],
    date: variables[5],
    token: {
      username: username,
      organisation: organisation,
    },
  };
};
const apiname = process.env.API_NAME || "API";
const AWSSettings = require("./config/database").settings;
const awstransport = new CloudWatchTransport({
  logGroupName: "api-calls",
  logStreamName: apiname,
  createLogGroup: false,
  createLogStream: true,
  submissionInterval: 2000,
  submissionRetryCount: 1,
  batchSize: 1,
  awsConfig: {
    accessKeyId: AWSSettings.accessKeyId,
    secretAccessKey: AWSSettings.secretAccessKey,
    region: AWSSettings.awsregion,
  },
  formatLog: (item) => `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
});
// @ts-ignore
const logger = new winston.createLogger({
    // transports: [new winston.transports.MongoDB(winstonOptions)],
    transports: [awstransport],
    format: winston.format.combine(addAppNameFormat(), winston.format.json()),
    // @ts-ignore
    dynamicMeta: function (req, res, err) {
      return req.header;
    },
    meta: true,
    expressFormat: true,
    colorize: false,
  }),
  loggerstream = {
    write: function (message, encoding) {
      logger.info(message.replace(/\n$/, ""), {
        metaData: parseMessage(message.replace(/\n$/, "")),
      });
    },
  };
app.use(
  morgan(":method|:url|:status|:res[content-length]|:response-time|:date[iso]|:token", {
    stream: loggerstream,
  })
);

// SETTINGS FOR OUR API
// =============================================================================
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// app.use("/pathlabs", pathlabs);
// app.use("/testcentre", testcentre);
// app.use("/componenttypes", componenttypes);
// app.use("/pathways", pathways);
// app.use("/lamp90", lamp90);
// app.use("/trainingresources", trainingresources);
// app.use("/registerstaff", registerstaff);
// app.use("/training", training);
// app.use("/testrequests", testrequests);
// app.use("/staffconsent", staffconsent);
// app.use("/results", results);
// app.use("/pathwaydata", pathway_data);
// app.use("/reminders/lamp90", lamp90reminders);
// app.use("/orgstructures", orgstructures);
// app.use("/staffarea", staffarea);
// app.use("/orgacknowledgements", orgacknowledgements);
// app.use("/labdata", labdata);
// app.use("/lists", lists);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
// ROUTES FOR OUR API
// =============================================================================
app.get("/", (req, res) => {
  res.send("Invalid endpoint");
});

// EXPORT APP
// =============================================================================
module.exports = app;
