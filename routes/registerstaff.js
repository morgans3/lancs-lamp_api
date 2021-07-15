// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const registerstaff = require("../models/registerstaff");
const healthinfo_codes = require("../models/healthinfo_codes");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: RegisterStaff
 *   description: Storage system for Staff Information relating to Lancs LAMPS
 */

/**
 * @swagger
 * /registerstaff/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the whole collection
 *     tags:
 *      - RegisterStaff
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
    registerstaff.getAll(function (err, result) {
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
 * /registerstaff/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  email:
 *                     type: string
 *                  name:
 *                     type: string
 *                  username:
 *                     type: string
 *                  lamp_access:
 *                     type: string
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
      email: item.email,
      name: item.name,
      username: item.username,
      lamp_access: item.lamp_access,
    };

    registerstaff.addResource(newItem, (err, user) => {
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
 * /registerstaff/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  username:
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
    const username = req.body.username;
    registerstaff.removeResourceByUsername(username, function (err, result) {
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
 * /registerstaff/getByEmail:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single set of details
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  email:
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
  "/getByEmail",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const email = req.body.email;
    res.type("application/json");
    if (email === undefined || email === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      registerstaff.getByEmail(email, function (err, result) {
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
 * /registerstaff/getByUsername:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single set of details
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  username:
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
  "/getByUsername",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const username = req.body.username;
    res.type("application/json");
    if (username === undefined || username === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      registerstaff.getByUsername(username, function (err, result) {
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
 * /registerstaff/updateHealthInfo:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff details.
 *           schema:
 *                type: object
 *                properties:
 *                  email:
 *                     type: string
 *                  phone:
 *                     type: string
 *                  username:
 *                     type: string
 *                  date_of_birth:
 *                     type: string
 *                  organisation:
 *                     type: string
 *                  nhsnumber:
 *                     type: string
 *                  occupation:
 *                     type: string
 *                  consentA:
 *                     type: boolean
 *                  consentB:
 *                     type: boolean
 *                  consentC:
 *                     type: boolean
 *                  my_health_info_code:
 *                     type: string
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
  "/updateHealthInfo",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    if (item.my_health_info_code) {
      healthinfo_codes.updateResource(item.my_health_info_code, item, (err, user) => {
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
      healthinfo_codes.addResource(item, (err, user) => {
        if (err) {
          res.json({
            success: false,
            msg: "Failed to register: " + err,
          });
        } else {
          res.json({
            success: true,
            msg: "Registered",
            healthcode: user.rows[0].id,
          });
        }
      });
    }
  }
);

/**
 * @swagger
 * /registerstaff/loadHealthInfo:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns my Health Info
 *     tags:
 *      - RegisterStaff
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/loadHealthInfo",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const auth = req.headers["authorization"];
    if (auth) {
      const decoded = jwt.decode(auth.replace("JWT ", ""));
      const roles = decoded["roles"];
      if (roles && roles.length > 0) {
        let health_code;
        roles.forEach((element) => {
          if (element.healthinfo_code) {
            health_code = element.healthinfo_code;
          }
        });
        if (health_code) {
          healthinfo_codes.getByID(health_code, function (err, result) {
            if (err) {
              res.send(err);
            } else {
              if (result.rows.length > 0) {
                res.json({
                  success: true,
                  result: result.rows,
                });
              } else {
                res.json({
                  success: false,
                  msg: "Not registered",
                });
              }
            }
          });
        } else {
          res.status(200).json({
            success: false,
            msg: "No assigned code",
          });
        }
      } else {
        res.status(200).json({
          success: false,
          msg: "No assigned roles",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        msg: "Bad request",
      });
    }
  }
);

module.exports = router;
