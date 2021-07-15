// @ts-check
const pool = require("../config/database").pool;
const tablename = "testcentres";

module.exports.getByTestCentre = function (testcentre, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE testcentre ='` + testcentre + `'`;
  pool.query(geoquery, (err, data) => {
    if (err) callback(err, data);
    else {
      jsonparseLocation(data.rows, callback);
    }
  });
};

module.exports.getOpenTestCentres = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE (closing IS NULL) OR (opening > now() AND closing < now());`;
  pool.query(geoquery, (err, data) => {
    if (err) callback(err, data);
    else {
      jsonparseLocation(data.rows, callback);
    }
  });
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, (err, data) => {
    if (err) callback(err, data);
    else {
      jsonparseLocation(data.rows, callback);
    }
  });
};

module.exports.removeItem = function (testcentre, createdDT, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE testcentre ='` + testcentre + `' AND createdDT = '` + createdDT + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.testcentre, newItem.location, newItem.node, newItem.opening, newItem.owner, newItem.closing, newItem.pathlab];
  const geoquery = `INSERT INTO public.` + tablename + ` (testcentre, location, node, opening, owner, closing, pathlab) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.location, updatedItem.node, updatedItem.opening, updatedItem.owner, updatedItem.closing, updatedItem.pathlab];
  const geoquery = `UPDATE public.` + tablename + ` SET location = $1, node = $2, opening = $3, owner = $4, closing = $5, pathlab = $6, "updatedDT" = CURRENT_TIMESTAMP WHERE testcentre ='` + updatedItem.testcentre + `' AND createdDT = '` + updatedItem.createdDT + `'`;
  pool.query(geoquery, values, callback);
};

function jsonparseLocation(data, callback) {
  const cleansed = [];
  data.forEach((element) => {
    if (element.location) element.location = JSON.parse(element.location);
    cleansed.push(element);
  });
  callback(null, cleansed);
}
