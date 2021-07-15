// @ts-check
const pool = require("../config/database").pool;
const tablename = "trainingresources";

module.exports.addResource = function (resource, callback) {
  const values = [resource.url, resource.name, resource.order, resource.section];
  const geoquery = `INSERT INTO public.` + tablename + `(url, name, "order", section) VALUES ($1, $2, $3, $4) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.removeResource = function (resource, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE url ='` + resource.url + `' AND name = '` + resource.name + `'`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};
