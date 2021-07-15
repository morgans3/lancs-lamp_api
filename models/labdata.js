// @ts-check
const pool = require("../config/database").pool;

const receipts = "lamp90_lab_receipts";
const rejection_reasons = "rejection_reasons";

module.exports.getAllLabReceipts = function (callback) {
  const geoquery = `SELECT * FROM public.` + receipts + `;`;
  pool.query(geoquery, callback);
};

module.exports.getAllRejectionReasons = function (callback) {
  const geoquery = `SELECT * FROM public.` + rejection_reasons + `;`;
  pool.query(geoquery, callback);
};
