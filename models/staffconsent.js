// @ts-check
const pool = require("../config/database").pool;
const tablename = "staffconsent";

module.exports.addResource = function (resource, callback) {
  const values = [resource.nhsnumber, resource.consentsharing];
  const geoquery = `INSERT INTO public.` + tablename + `(nhsnumber, consentsharing) VALUES ($1, $2) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.removeResourceByNHSNumber = function (nhsnumber, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE nhsnumber ='` + nhsnumber + `'`;
  pool.query(geoquery, callback);
};

module.exports.updateResourceByNHSNumber = function (nhsnumber, consent, callback) {
  const geoquery = `UPDATE public.` + tablename + ` SET consentsharing=` + consent.toString() + ` WHERE nhsnumber ='` + nhsnumber + `'`;
  pool.query(geoquery, callback);
};

module.exports.getByNHSNumber = function (nhsnumber, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE nhsnumber ='` + nhsnumber + `';`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};
