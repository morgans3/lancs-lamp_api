// @ts-check
const PathwayData = require("./pathway_data");
const async = require("async");

module.exports.getByOccupation = function (occupation, limit, startdate, enddate, token, callback) {
  PathwayData.getByOccupation(occupation, limit, (err, result) => {
    if (err) callback(err, null);
    else {
      processresults(result.rows, startdate, enddate, token, callback);
    }
  });
};

function processresults(serverresponse, start, end, token, callback) {
  if (serverresponse.length > 0) {
    const patientcsv = serverresponse.filter((x) => new Date(start) <= new Date(x.requestedDT) && new Date(x.requestedDT) <= new Date(end));
    async.mapSeries(
      patientcsv,
      (patient, innercallback) => {
        getPatient(patient.nhs_number, patient.date_of_birth, token, (err, res) => {
          if (err) return innercallback(err);
          if (res && res.surname) {
            // @ts-ignore
            patient.title = res.title;
            // @ts-ignore
            patient.forename = res.forename;
            // @ts-ignore
            patient.otherforenames = res.otherforenames;
            // @ts-ignore
            patient.surname = res.surname;
            // @ts-ignore
            patient.postcode = res.postcode;
            // @ts-ignore
            patient.gender = res.gender;
            const address = res.addressline1 + ", " + res.addressline2 + ", " + res.addressline3 + ", " + res.addressline4 + ", " + res.addressline5;
            // @ts-ignore
            patient.address = address.replace("null,", "").replace(" null,", "");
            innercallback(null, patient);
          } else {
            innercallback(null, patient);
          }
        });
      },
      // @ts-ignore
      (err, results) => {
        callback(null, results);
      }
    );
  } else {
    callback(null, []);
  }
}

function getPatient(nhsnumber, date_of_birth, _authtoken, callback) {
  // implement Patient Demographics Service
  const testPatient = {
    nhsnumber: nhsnumber,
    date_of_birth: date_of_birth,
    title: "Title",
    forename: "Forename",
    otherforenames: "Other",
    surname: "FamilyName",
    postcode: "FY3 8NR",
    gender: "U",
    addressline1: "Whinney Heys Rd",
    addressline2: "Blackpool",
    addressline3: "",
    addressline4: "Lancashire",
    addressline5: "United Kingdom",
  };
  callback(null, testPatient);
}
