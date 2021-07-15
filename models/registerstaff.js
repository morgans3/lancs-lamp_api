// @ts-check
const pool = require("../config/database").pool;
const tablename = "registeredstaff";

module.exports.addResource = function (resource, callback) {
  const values = [resource.name, resource.email, resource.username, resource.lamp_access];
  const geoquery = `INSERT INTO public.` + tablename + `(name, email, username, lamp_access) VALUES ($1, $2, $3, $4) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.removeResourceByUsername = function (username, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE username ='` + username + `'`;
  pool.query(geoquery, callback);
};

module.exports.getByUsername = function (username, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE username ='` + username + `';`;
  pool.query(geoquery, callback);
};

module.exports.getByEmail = function (email, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE email ='` + email + `';`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};
