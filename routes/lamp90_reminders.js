// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const Reminders = require("../models/reminders");

/**
 * @swagger
 * tags:
 *   name: LAMP90Reminders
 *   description: Reminders for LAMP90 Staff Testing
 */

/**
 * @swagger
 * /reminders/lamp90/staffreminders:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Reminds staff who had a negative test seven days ago to take another test
 *     tags:
 *      - LAMP90Reminders
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Reminders sent
 *         schema:
 *               type: boolean
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.get(
  "/staffreminders",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    res.type("application/json");
    Reminders.sendNegativeReminders(req.headers.authorization, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(JSON.stringify(result));
      }
    });
  }
);

/**
 * @swagger
 * /reminders/lamp90/stafffollowsups:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Sends a follow up to staff who had a positive test ninety days ago
 *     tags:
 *      - LAMP90Reminders
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Follow Ups sent
 *         schema:
 *               type: boolean
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.get(
  "/stafffollowsups",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    res.type("application/json");
    Reminders.sendPositiveReminders(req.headers.authorization, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(JSON.stringify(result));
      }
    });
  }
);

module.exports = router;
