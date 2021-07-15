// @ts-check
const pool = require("../config/database").pool;
const fs = require("fs");
const parse = require("csv-parse");
const async = require("async");
const tablename = "public.lamp90_results";

module.exports.processCSV = function (newFile, callback) {
  let gberror = "";
  fs.readFile(newFile, (err, fd) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.error("file does not exist");
      }
      callback(err, null);
    } else {
      const parser = parse(
        fd,
        {
          delimiter: "\t",
          trim: true,
          from_line: 12,
          to_line: 100,
          skip_lines_with_error: true,
        },
        function (error, output) {
          if (error) {
            gberror += error;
          } else {
            callback(error, output);
          }
        }
      );
      parser.on("skip", function (err) {
        // return;
      });
    }
  });
};

module.exports.storeInPG = function (data, callback) {
  if (data.length > 0 && data[0].length === 1) {
    const newdata = [];
    data.forEach((element) => {
      newdata.push(element[0].toString().split('"').join("").split("\t"));
    });
    data = newdata;
  }
  const filterdata = data.filter((x) => (x[3] === "POSITIVE" || x[3] === "NEGATIVE") && x[1] !== "" && x[1] !== null && x[1].indexOf("LA2") > -1);
  let query = "INSERT INTO " + tablename + " (result_run_num, barcode_value, type, result, parameter, value, unit, extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  let gberror = "";
  async.mapSeries(
    filterdata,
    function (values, outerCB) {
      pool.query(query, values.slice(0, 8), outerCB);
    },
    function (err, results) {
      if (err) {
        callback(err, gberror);
      } else {
        callback(null, true);
      }
    }
  );
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM ` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getByWellID = function (id, callback) {
  const geoquery = `SELECT * FROM ` + tablename + ` WHERE barcode_value = '` + id + `';`;
  pool.query(geoquery, callback);
};

module.exports.getPositives = function (callback) {
  const geoquery = `SELECT * FROM ` + tablename + ` WHERE result = 'POSITIVE';`;
  pool.query(geoquery, callback);
};
