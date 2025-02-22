const express = require("express");
const dialogflow = require("@google-cloud/dialogflow");
const dotenv = require("dotenv");
const axios = require("axios");

const router = express.Router();
dotenv.config();

const getDialogflowCredentials = () => {
  try {
    if (process.env.DIALOGFLOW_KEY_PATH_BASE_64) {
      console.log("🔵 Decoding credentials from BASE64");
      const decoded = Buffer.from(process.env.DIALOGFLOW_KEY_PATH_BASE_64, "base64").toString("utf8");
      return JSON.parse(decoded);
    }
    throw new Error("❌ DIALOGFLOW_KEY_PATH_BASE_64 is missing. Cannot load credentials.");
  } catch (error) {
    console.error("❌ Error loading Dialogflow credentials:", error.message);
    throw new Error("Dialogflow credentials not found or invalid.");
  }
};

const sessionClient = new dialogflow.SessionsClient({
  credentials: getDialogflowCredentials(),
});

// Store user sessions
const userSessions = {};

// Dialogflow webhook route
router.post("/webhook", async (req, res) => {
  try {
    console.log("🔵 Webhook received request:", req.body);

    const projectId = process.env.DIALOGFLOW_PROJECT_ID;
    const sessionId = req.body.sessionId || "default-session";
    const queryText = req.body.queryInput?.text?.text?.trim();

    if (!queryText) {
      return res.status(400).json({ error: "Query input is required." });
    }

    const sessionPath = `projects/${projectId}/agent/sessions/${sessionId}`;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: queryText,
          languageCode: "en",
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    const intentName = result.intent?.displayName || "No intent detected";

    console.log("🟢 Intent Detected:", intentName);

    let botResponse = result.fulfillmentText;

    // If another intent is called before providing an email, clear the session
    if (intentName !== "GetPortfolioSummary" && userSessions[sessionId]?.waitingForEmail) {
      console.log("🟠 Another intent detected before email. Resetting session.");
      delete userSessions[sessionId];
    }

    if (intentName === "GetPortfolioSummary") {
      if (userSessions[sessionId]?.waitingForEmail) {
        console.log("🟠 Email received:", queryText);

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(queryText)) {
          botResponse = "❌ Invalid email format. Please enter a valid email.";
          return res.json({ response: botResponse });
        }

        delete userSessions[sessionId]; // Reset session after receiving valid email
        botResponse = "📊 Fetching your portfolio summary...";

        try {
          console.log("🔵 Calling portfolio API...");

          const headers = {
            "x-webhook-request": "true",
            "Content-Type": "application/json",
          };

          console.log("📤 Headers being sent:", headers);

          const portfolioResponse = await axios.post(
            "https://wealtsphere.onrender.com/api/user/webhookPortfolio",
            { username: queryText },
            { headers }
          );

          console.log("🟢 Portfolio API Response:", portfolioResponse.data);

          let finalResponse;
          if (portfolioResponse.data.newUserWithNoFunds) {
            finalResponse = "🚀 Welcome! It looks like you're new here. Start adding assets to build your portfolio.";
          } else if (!portfolioResponse.data.success) {
            finalResponse = "❌ Couldn't fetch portfolio. Please check your email and try again.";
          } else {
            const { totalValue, assetValues } = portfolioResponse.data;
            finalResponse = `📊 **Your Portfolio Summary:**\n\n` +
            `💰 **Total Value:** ₹${totalValue}\n\n` +
            `📈 **Stocks:** ₹${assetValues.stockTotal} \n` +
            `🏦 **FDs:** ₹${assetValues.fdTotal} \n` +
            `💵 **Cash:** ₹${assetValues.cashTotal}\n` +
            `₿ **Crypto:** ₹${assetValues.cryptoTotal}`;
          }

          return res.json({ response: finalResponse });
        } catch (error) {
          console.error("❌ Error fetching portfolio:", error.message);
          return res.json({ response: "❌ Error fetching portfolio. Please try again later." });
        }
      } else {
        console.log("🟠 User requested portfolio summary. Waiting for email...");
        userSessions[sessionId] = { waitingForEmail: true };
        botResponse = "Please provide your registered email to fetch your portfolio.";
      }
    }

    return res.json({ response: botResponse });
  } catch (error) {
    console.error("❌ Dialogflow Error:", error.message);
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

module.exports = router;
