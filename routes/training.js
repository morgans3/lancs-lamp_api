// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const training = require("../models/training");

/**
 * @swagger
 * tags:
 *   name: Training
 *   description: Storage system for Lancs LAMP Training
 */

/**
 * @swagger
 * /training/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - Training
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
 *                  username:
 *                     type: string
 *                  name:
 *                     type: string
 *                  agreedterms:
 *                     type: string
 *                  roleselected:
 *                     type: string
 *                  email:
 *                     type: string
 *                  organisation:
 *                     type: string
 */
router.get(
  "/getAll",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    training.getAll(function (err, result) {
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
 * /training/completeTraining:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers that training has been completed
 *     tags:
 *      - Training
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Trained Staff
 *           schema:
 *                type: object
 *                properties:
 *                  username:
 *                     type: string
 *                  name:
 *                     type: string
 *                  agreedterms:
 *                     type: string
 *                  roleselected:
 *                     type: string
 *                  email:
 *                     type: string
 *                  organisation:
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
  "/completeTraining",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    let newItem = {
      username: item.username,
      name: item.name,
      agreedterms: item.agreedterms,
      roleselected: item.roleselected,
      email: item.email,
      organisation: item.organisation,
    };

    training.addResource(newItem, (err, user) => {
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
 * /training/isTrainingComplete:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Checks that training has been completed
 *     tags:
 *      - Training
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Trained Staff
 *           schema:
 *                type: object
 *                properties:
 *                  username:
 *                     type: string
 *                  organisation:
 *                     type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Check (success- has the query worked, answer- has training been completed)
 *         schema:
 *            type: object
 *            properties:
 *                  success:
 *                     type: boolean
 *                  answer:
 *                     type: boolean
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
  "/isTrainingComplete",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const username = req.body.username;
    const organisation = req.body.organisation;

    training.getByUsernameAndOrg(username, organisation, (err, result) => {
      if (err) {
        res.json({
          success: false,
          answer: null,
        });
      } else {
        if (result.rows.length > 0) {
          res.json({
            success: true,
            answer: true,
          });
        } else {
          res.json({
            success: true,
            answer: false,
          });
        }
      }
    });
  }
);

module.exports = router;
