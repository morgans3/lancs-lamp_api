// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const Lamp90 = require("../models/lamp90_results");
// @ts-ignore
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const config = require("../config/database");
const aws = config.AWS;
const s3 = new aws.S3();

/**
 * @swagger
 * tags:
 *   name: Lamp90
 *   description: Storage system for Lamp90 Machine Results
 */

/**

/**
 * @swagger
 * /lamp90/resultsfile:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Saves a File to the Database
 *     tags:
 *      - Lamp90
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: file
 *         description: File
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Confirmation of File Storage
 */
router.post(
  "/resultsfile",
  passport.authenticate("jwt", {
    session: false,
  }),
  upload.single("file"),
  (req, res, next) => {
    // @ts-ignore
    if (!req.file || Object.keys(req.file).length === 0) {
      res.status(400).send({ err: "No files were uploaded." });
    } else {
      // @ts-ignore
      let sampleFile = req.file;
      if (sampleFile.originalname.toLowerCase().includes("csv")) {
        fs.rename(sampleFile.path, sampleFile.path + ".csv", (err) => {
          if (err) {
            res.status(400).send({ err: "Error processing CSV File, reason: " + err });
          } else {
            const filename = sampleFile.path + ".csv";
            fs.readFile(filename, function (err, data) {
              if (err) {
                console.log("Unable to Read file. Item added to Database but file not stored");
              } else {
                let newbucketParams = {
                  Bucket: config.settings.AWS_BUCKET_NAME_LAMP,
                  Key: filename,
                  Body: data,
                };
                // @ts-ignore
                s3.putObject(newbucketParams, (err, data2) => {
                  if (err) {
                    console.log("Item added to Database but file not S3");
                  }
                });
              }
            });

            Lamp90.processCSV(filename, (error, result) => {
              if (error) {
                res.status(200).send({ success: false, err: "Error processing CSV File, reason: " + error });
              } else {
                // @ts-ignore
                Lamp90.storeInPG(result, (DBerror, DBresult) => {
                  if (DBerror) {
                    res.status(200).send({ success: false, err: "Database unavailable, reason: " + DBerror });
                  } else {
                    fs.unlink(filename, (err) => {
                      if (err) {
                        console.log("ERROR: " + filename + " was not deleted.Reason: " + err);
                      }
                    });
                    res.json({
                      success: true,
                      msg: "CSV File Processed",
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        res.status(400).send({ err: "File not a CSV file" });
      }
    }
  }
);

/**
 * @swagger
 * /lamp90/getByWellID:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single Lab's result
 *     tags:
 *      - Lamp90
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: result
 *           description: Result details.
 *           schema:
 *                type: object
 *                properties:
 *                  well_barcode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Result Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getByWellID",
  passport.authenticate("jwt", {
    session: false,
  }),
  // @ts-ignore
  (req, res, next) => {
    const well_barcode = req.body.well_barcode;
    res.type("application/json");
    if (well_barcode === undefined || well_barcode === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      Lamp90.getByWellID(well_barcode, function (err, result) {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result.rows.length > 0) {
            res.send(JSON.stringify(result.rows));
          } else {
            res.send("[]");
          }
        }
      });
    }
  }
);

/**
 * @swagger
 * /lamp90/getPositives:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - Lamp90
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getPositives",
  passport.authenticate("jwt", {
    session: false,
  }),
  // @ts-ignore
  (req, res, next) => {
    Lamp90.getPositives(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows.length > 0) {
          res.send(JSON.stringify(result.rows));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

/**
 * @swagger
 * /lamp90/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - Lamp90
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getAll",
  passport.authenticate("jwt", {
    session: false,
  }),
  // @ts-ignore
  (req, res, next) => {
    Lamp90.getAll(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows.length > 0) {
          res.send(JSON.stringify(result.rows));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

module.exports = router;
