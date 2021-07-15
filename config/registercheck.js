// @ts-check
const port = process.env.PORT || 8099;
const adminkey = process.env.ADMINKEY || "YOUR_INSECURE_KEY";
module.exports = function (req, res, next) {
  const origin = req.get("origin");
  const key = req.get("authorization");
  if (origin === "http://localhost:" + port.toString() || key.includes(adminkey)) {
    next();
  } else {
    console.log("Unknown referer attempted to create an account: " + origin);
    res.status(400).json({
      success: false,
      msg: "Unknown referer",
    });
  }
};
