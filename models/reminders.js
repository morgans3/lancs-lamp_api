// @ts-check
const async = require("async");
const pool = require("../config/database").pool;

module.exports.sendNegativeReminders = function (occupations, pathways, jwt, callback) {
  const geoquery =
    `SELECT pdata.*, previous_test_id, logs.id AS logid FROM public.pathway_data_collected as pdata LEFT OUTER JOIN public.pathway_reminders_log as logs
  ON pdata.id = logs.previous_test_id
  WHERE pdata.pathwayid IN (` +
    pathways.join(",") +
    `)
  AND pdata.occupation IN ('` +
    occupations.join("','") +
    `')
  AND pdata.result = 'NEGATIVE'
  AND logs."reminderDT" IS NULL
  AND pdata."requestedDT" BETWEEN current_date - 7 AND current_date - 6
  AND pdata.nhs_number NOT IN (SELECT nhs_number FROM public.pathway_data_collected WHERE nhs_number IS NOT NULL AND "requestedDT" > current_date - 6)`;
  pool.query(geoquery, (err, data) => {
    if (err) {
      callback(err, null);
    } else if (data.rows && data.rowCount > 0) {
      async.mapSeries(
        data.rows,
        (values, outerCB) => {
          reminderSend(values, "NEGATIVE", jwt, outerCB);
        },
        (err, results) => {
          if (err) {
            callback(err, false);
          } else {
            console.log("Reminders sent: " + data.rowCount);
            callback(null, true);
          }
        }
      );
    } else {
      callback(null, true);
    }
  });
};

const reminderSend = function (pathwayItem, remindertype, jwt, callback) {
  // implement Reminder SMS/Email service
  // on success, callback
  logReminder(pathwayItem, remindertype, callback);
};

const logReminder = function (pathwayItem, remindertype, callback) {
  const query = `INSERT INTO public.pathway_reminders_log (previous_test_id, reminder_type) VALUES ($1, $2)`;
  const values = [pathwayItem.id, remindertype];
  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err, false);
    } else {
      callback(null, true);
    }
  });
};

module.exports.sendPositiveReminders = function (occupations, pathways, jwt, callback) {
  const geoquery =
    `SELECT pdata.*, previous_test_id, logs.id AS logid FROM public.pathway_data_collected as pdata LEFT OUTER JOIN public.pathway_reminders_log as logs
  ON pdata.id = logs.previous_test_id
  WHERE pdata.pathwayid IN (` +
    pathways.join(",") +
    `)
    AND pdata.occupation IN ('` +
    occupations.join("','") +
    `')
  AND pdata.result = 'POSITIVE'
  AND logs."reminderDT" IS NULL
  AND pdata."requestedDT" BETWEEN current_date - 28 AND current_date - 27
  AND pdata.nhs_number NOT IN (SELECT nhs_number FROM public.pathway_data_collected WHERE nhs_number IS NOT NULL AND "requestedDT" > current_date - 27)`;
  pool.query(geoquery, (err, data) => {
    if (err) {
      callback(err, null);
    } else if (data.rows && data.rowCount > 0) {
      async.mapSeries(
        data,
        (values, outerCB) => {
          reminderSend(values, "POSITIVE", jwt, outerCB);
        },
        (err, results) => {
          if (err) {
            callback(err, false);
          } else {
            console.log("Reminders sent: " + data.rowCount);
            callback(null, true);
          }
        }
      );
    } else {
      callback(null, true);
    }
  });
};
