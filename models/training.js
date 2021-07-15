// @ts-check
const pool = require("../config/database").pool;
const tablename = "registeredstaff";

module.exports.addResource = function (resource, callback) {
  const values = [resource.username, resource.agreedterms, resource.roleselected, resource.email, resource.organisation, resource.name];
  const geoquery = `INSERT INTO public.` + tablename + `(username, hipres_access, roleselected, email, organisation, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getByUsernameAndOrg = function (username, org, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE username = '` + username + `' AND organisation = '` + org + `';`;
  pool.query(geoquery, callback);
};
