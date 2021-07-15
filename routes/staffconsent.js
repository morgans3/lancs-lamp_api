// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const staffconsent = require("../models/staffconsent");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: StaffConsent
 *   description: Storage system for Staff consent relating to Lancs LAMP sharing
 */

/**
 * @swagger
 * /staffconsent/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the whole collection
 *     tags:
 *      - StaffConsent
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
    staffconsent.getAll(function (err, result) {
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
 * /staffconsent/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - StaffConsent
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
 *                     type: string
 *                  consentsharing:
 *                     type: boolean
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
    let newItem = {
      nhsnumber: item.nhsnumber,
      consentsharing: item.consentsharing,
    };

    staffconsent.addResource(newItem, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to register: " + err,
        });
      } else {
        res.json({
          success: true,
          msg: "Registered",
          registered: user.rows[0],
        });
      }
    });
  }
);

/**
 * @swagger
 * /staffconsent/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - StaffConsent
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
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
    const nhsnumber = req.body.nhsnumber;
    staffconsent.removeResourceByNHSNumber(nhsnumber, function (err, result) {
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
 * /staffconsent/getByNHSNumber:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single set of details
 *     tags:
 *      - StaffConsent
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getByNHSNumber",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const nhsnumber = req.body.nhsnumber;
    res.type("application/json");
    if (nhsnumber === undefined || nhsnumber === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      staffconsent.getByNHSNumber(nhsnumber, function (err, result) {
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
 * /staffconsent/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - StaffConsent
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
 *                     type: string
 *                  consentsharing:
 *                     type: boolean
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
  "/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    if (item.nhsnumber && item.consentsharing !== undefined) {
      staffconsent.updateResourceByNHSNumber(item.nhsnumber, item.consentsharing, (err, user) => {
        if (err) {
          res.json({
            success: false,
            msg: "Failed to update: " + err,
          });
        } else {
          res.json({
            success: true,
            msg: "Updated",
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Bad request",
      });
    }
  }
);

module.exports = router;
