const express = require("express");
const axios = require("axios");
const router = express.Router();

const ML_SERVICE_URL = "http://localhost:5001";

//get companies list
router.get("c/ompanies", async (req, req) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/companies`);
    res.json(response.data);
  } catch (error) {
    console.error("Error Fetching Companies: ", error.message);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

//get destinations list

router.get("/designations", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/designations`);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Designations" });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const { company, designation, userId } = req.body;
    if (!company || !designation) {
      return res
        .status(400)
        .json({ error: `Company and Designation are required ` });
    }

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      company,
      designation,
    });
    res.json(response.data);
    //save user request to the mongoDB
  } catch (error) {
    res.status(500).json({ error: `Failed to analyse skills` });
  }
});

module.exports = router;
