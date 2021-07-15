// @ts-check
const access = process.env.AWSPROFILE || "Dev";
const Request = require("request");
const pool = require("../config/database").pool;

module.exports.getRejections = function (callback) {
  const geoquery = `SELECT receipt.*, reasons.reason FROM public.lamp90_lab_receipts as receipt LEFT OUTER JOIN public.rejection_reasons as reasons
  ON receipt."rejectedID" = reasons.id
  WHERE status='REJECTED' AND "reject_notification_sentDT" IS NULL`;
  pool.query(geoquery, callback);
};

module.exports.updateInformation = function (barcode, result, callback) {
  const geoquery = `UPDATE public.pathway_data_collected SET "notify_citizenDT"=current_timestamp, result='` + result + `' WHERE barcode_value = '` + barcode + `' RETURNING *;`;
  pool.query(geoquery, callback);
};

module.exports.updateRejection = function (barcode, callback) {
  const geoquery = `UPDATE public.lamp90_lab_receipts SET "reject_notification_sentDT"=current_timestamp WHERE barcode_value = '` + barcode + `' RETURNING *;`;
  pool.query(geoquery, callback);
};

module.exports.broadcastResult = function (result, reason, token, callback) {
  if (result.notify_citizenDT) {
    const body = {};
    let endpoint = "/results/notify";
    if (reason) {
      endpoint = "/rejections/notify";
      body["params"] = {
        pathway: result.xds_document_name,
        reason: reason,
      };
    } else {
      body["nhsnumber"] = result.nhs_number;
      body["params"] = {
        pathway: result.xds_document_name,
        pathlab: result.pathlab,
      };
    }

    if (result.citizen_preferred_email) {
      body.email = result.citizen_preferred_email;
    } else if (result.citizen_preferred_mobile) {
      body.phone = result.citizen_preferred_mobile;
    }
    body.organisation = result.occupation;

    const options = {
      headers: {
        authorization: token,
      },
      body: body,
      json: true,
    };
    // Send a Post Request to your messaging service, where it will send a SMS/Email to the test subject based on endpoint (result or rejection message)

    // EXAMPLE
    // let subdomain = "";
    // if (access === "Dev") {
    //   subdomain = "dev.";
    // }
    // Request.post("https://messaging." + subdomain + domain + endpoint, options, (error, response, body) => {
    //   if (response.statusCode && response.statusCode === 200) {
    //     callback(null, response.body);
    //   } else {
    //     callback(error, response);
    //   }
    // });
    callback(null, "response.body");
  } else {
    callback("Citizen already notified of result", null);
  }
};

module.exports.reportIssue = function (barcode, reason, token, callback) {
  // implement an alerting system
};
