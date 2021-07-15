// @ts-check
const pool = require("../config/database").pool;
const tablename = "pathway_data_collected";

module.exports.getByNHSNumber = function (nhsnumber, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE nhs_number ='` + nhsnumber + `';`;
  pool.query(geoquery, callback);
};

module.exports.getByUsername = function (username, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE requested_by ='` + username + `';`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};
