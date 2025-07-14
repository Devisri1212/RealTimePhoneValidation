const express = require("express");
const axios   = require("axios");
const cors    = require("cors");
require("dotenv").config();

const app     = express();
const PORT    = process.env.PORT || 3000;
const API_KEY = process.env.CLEAROUTPHONE_API_TOKEN;
const API_URL = "https://api.clearoutphone.io/v1/phonenumber/validate";

if (!API_KEY) {
  console.error("❌  CLEAROUTPHONE_API_TOKEN missing in .env");
  process.exit(1);
}

// ─── middleware ───
app.use(cors());
app.use(express.json());

// serve everything inside /public at the root URL
app.use(express.static("public"));

// ─── API route ───
app.post("/validate", async (req, res) => {
  const { number, country_code } = req.body;
  if (!number) return res.status(400).json({ error: "number field required" });

  try {
    const { data } = await axios.post(
      API_URL,
      { number, country_code },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      }
    );

    res.json(data);
  } catch (err) {
    const details = err?.response?.data || err.message;
    res.status(err?.response?.status || 500).json({ error: details });
  }
});

// ─── start ───
app.listen(PORT, () =>
  console.log(`☎️  Server + form available at http://localhost:${PORT}`)
);
