module.exports.SecureEndpoints = [
  {
    url: `/pathlabs/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/pathlabs/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/pathlabs/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/pathlabs/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/pathlabs/getlab`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testcentre/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/testcentre/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testcentre/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testcentre/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testcentre/gettestcentre`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testcentre/getOpenTestCentres`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lamp90/resultsfile`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lamp90/getByWellID`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lamp90/getPositives`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lamp90/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/pathwaydata/getByOccupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/pathwaydata/getByOccupationAndTime`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/pathwaydata/getPositives`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/pathwaydata/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/registerstaff/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/registerstaff/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/registerstaff/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/registerstaff/getByEmail`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/registerstaff/getByUsername`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/registerstaff/updateHealthInfo`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/registerstaff/loadHealthInfo`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/results/processrejections`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/results/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffconsent/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/staffconsent/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffconsent/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffconsent/getByNHSNumber`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffconsent/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testrequests/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/testrequests/getMyTests`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/testrequests/getTestsByNHSNumber`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/training/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/training/completeTraining`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/training/isTrainingComplete`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/trainingresources/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/trainingresources/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/trainingresources/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/reminders/lamp90/staffreminders`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/reminders/lamp90/stafffollowsups`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lists/getOccupations`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lists/getCensusOccupations`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lists/getEthnicities`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/lists/register_ethnicity`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/register_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/register_census_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/update_ethnicity`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/update_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/update_census_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/remove_ethnicity`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/remove_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/lists/remove_census_occupation`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgstructures/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/orgstructures/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgstructures/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgstructures/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgstructures/getbyorg`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/staffarea/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/update`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/getbyorg`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/getbyarea`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/staffarea/getbynhsnumber`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgacknowledgements/getAll`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/orgacknowledgements/register`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgacknowledgements/remove`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/orgacknowledgements/getbyorg`,
    type: "JWT",
    method: "post",
  },
  {
    url: `/labdata/getAllLabReceipts`,
    type: "JWT",
    method: "get",
  },
  {
    url: `/labdata/getAllRejectionReasons`,
    type: "JWT",
    method: "get",
  },
];
