var express = require("express");
var router = express.Router();
const {
  addBalance,
  widBalance,
  doubleOrNothing,
} = require("../controllers/auth");

router.post("/addBalance", addBalance);
router.post("/widBalance", widBalance);
router.post("/doubleOrNothing", doubleOrNothing);

module.exports = router;
