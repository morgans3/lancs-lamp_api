// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const trainingresources = require("../models/trainingresources");

/**
 * @swagger
 * tags:
 *   name: TrainingResources
 *   description: Storage system for Lancs LAMP Training Resources
 */

/**
 * @swagger
 * /trainingresources/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - TrainingResources
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 *         schema:
 *            type: array
 *            items:
 *                type: object
 *                properties:
 *                  url:
 *                     type: string
 *                  name:
 *                     type: string
 *                  order:
 *                     type: string
 *                  section:
 *                     type: string
 */
router.get(
  "/getAll",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    trainingresources.getAll(function (err, result) {
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
 * /trainingresources/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - TrainingResources
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Training Resources details.
 *           schema:
 *                type: object
 *                properties:
 *                  url:
 *                     type: string
 *                  name:
 *                     type: string
 *                  order:
 *                     type: string
 *                  section:
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
      url: item.url,
      name: item.name,
      order: item.order,
      section: item.section,
    };

    trainingresources.addResource(newItem, (err, user) => {
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
 * /trainingresources/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - TrainingResources
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Training Resource details.
 *           schema:
 *                type: object
 *                properties:
 *                  url:
 *                     type: string
 *                  name:
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
    const name = req.body.name;
    const url = req.body.url;
    const resource = { name: name, url: url };
    trainingresources.removeResource(resource, function (err, result) {
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

module.exports = router;
