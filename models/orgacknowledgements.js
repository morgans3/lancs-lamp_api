// @ts-check
const pool = require("../config/database").pool;
const tablename = "orgacknowledgements";

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getAllByOrg = function (org, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE organisation='` + org + `';`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (id, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE id ='` + id + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.barcode_value, newItem.username, newItem.organisation, newItem.displayname, newItem.nhsnumber];
  const geoquery = `INSERT INTO public.` + tablename + ` (barcode_value, username, organisation, displayname, nhsnumber) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  pool.query(geoquery, values, callback);
};
