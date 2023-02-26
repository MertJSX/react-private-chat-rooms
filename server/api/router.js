const express = require("express");
const router = express.Router();

router.get("/api/test", (req, res) => {
    res.send("sa")
})


module.exports = {router};