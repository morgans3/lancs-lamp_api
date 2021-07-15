// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const pathlabs = require("../models/pathlabs");

/**
 * @swagger
 * tags:
 *   name: Pathlabs
 *   description: Pathology Lab functions
 */

/**
 * @swagger
 * /pathlabs/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Pathlabs
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
  (req, res, next) => {
    pathlabs.getAll(function (err, result) {
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
 * /pathlabs/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - Pathlabs
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: pathlabs
 *           description: Path labs details.
 *           schema:
 *                type: object
 *                properties:
 *                  lab:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  organisation:
 *                    type: string
 *                  npexcode:
 *                    type: string
 *                  namedcontact:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Registration
 *       400:
 *         description: Bad Request, server doesn't understand input
 *       401:
 *         description: Unauthorised
 *       409:
 *         description: Conflict with something in Database
 *       500:
 *         description: Server Error Processing Result
 */
router.post(
  "/register",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    pathlabs.addItem(item, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to register: " + err,
        });
      } else {
        res.json({
          success: true,
          msg: "Registered",
        });
      }
    });
  }
);

/**
 * @swagger
 * /pathlabs/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - Pathlabs
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: pathlabs
 *           description: Path labs details.
 *           schema:
 *                type: object
 *                properties:
 *                  lab:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  organisation:
 *                    type: string
 *                  npexcode:
 *                    type: string
 *                  namedcontact:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Updating
 */
router.post(
  "/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const item = req.body;
    pathlabs.updateItem(item, function (err, data) {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to update: " + err,
        });
      }
      res.json({
        success: true,
        msg: "Item updated",
      });
    });
  }
);

/**
 * @swagger
 * /pathlabs/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - Pathlabs
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: pathlab
 *           description: Path Lab details.
 *           schema:
 *                type: object
 *                properties:
 *                  lab:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *     responses:
 *       200:
 *         description: Full List
 */
router.post(
  "/remove",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const lab = req.body.lab;
    const createdDT = req.body.createdDT;
    pathlabs.removeItem(lab, createdDT, function (err, result) {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to remove: " + err,
        });
      } else {
        res.json({
          success: true,
          msg: "Item removed",
        });
      }
    });
  }
);

/**
 * @swagger
 * /pathlabs/getlab:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single Lab's details
 *     tags:
 *      - Pathlabs
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: pathlabs
 *           description: Path labs details.
 *           schema:
 *                type: object
 *                properties:
 *                  lab:
 *                     type: string
 *     responses:
 *       200:
 *         description: Patient Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getlab",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const lab = req.body.lab;
    res.type("application/json");
    if (lab === undefined || lab === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      pathlabs.getItemByLab(lab, function (err, result) {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result.rows.length > 0) {
            res.send(JSON.stringify(result.rows[0]));
          } else {
            res.send("{}");
          }
        }
      });
    }
  }
);

module.exports = router;
