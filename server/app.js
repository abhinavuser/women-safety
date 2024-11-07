// server/app.js
const express = require("express");
const axios = require("axios"); // Use axios to interact with Appwrite

const app = express();
app.use(express.json());

// Replace these with your actual Appwrite endpoint and API Key
const APPWRITE_API_ENDPOINT = "https://YOUR_APPWRITE_ENDPOINT/v1";
const APPWRITE_API_KEY = "YOUR_APPWRITE_API_KEY";
const DATABASE_ID = "YOUR_DATABASE_ID";
const COLLECTION_ID = "YOUR_COLLECTION_ID";

// Get all alerts (from Appwrite)
app.get("/api/alerts", async (req, res) => {
  try {
    const response = await axios.get(
      `${APPWRITE_API_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
      {
        headers: {
          "X-Appwrite-Project": "YOUR_PROJECT_ID",
          "X-Appwrite-Key": APPWRITE_API_KEY,
        },
      }
    );
    res.json(response.data.documents);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).send("Error fetching alerts");
  }
});

// Update alert status (e.g., mark as resolved)
app.put("/api/alerts/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${APPWRITE_API_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${req.params.id}`,
      req.body,
      {
        headers: {
          "X-Appwrite-Project": "YOUR_PROJECT_ID",
          "X-Appwrite-Key": APPWRITE_API_KEY,
        },
      }
    );
    res.send({ message: "Alert updated", data: response.data });
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).send("Error updating alert");
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
