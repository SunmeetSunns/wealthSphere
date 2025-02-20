const express = require("express");
const dialogflow = require("@google-cloud/dialogflow");
const fs = require("fs");
const dotenv = require("dotenv");
const axios = require("axios");

const router = express.Router();
dotenv.config();

const getDialogflowCredentials = () => {
  try {
    const credentialsPath = process.env.DIALOGFLOW_KEY_PATH || "./dialogflow-key.json";
    return JSON.parse(fs.readFileSync(credentialsPath));
  } catch (error) {
    console.error("❌ Error loading Dialogflow credentials:", error);
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

    if (intentName === "GetPortfolioSummary") {
      if (userSessions[sessionId]?.waitingForEmail) {
        console.log("🟠 Email received:", queryText);

        if (!/\S+@\S+\.\S+/.test(queryText)) {
          botResponse = "❌ Invalid email format. Please enter a valid email.";
          return res.json({ response: botResponse });
        }

        delete userSessions[sessionId]; // Reset session state

        botResponse = "📊 Fetching your portfolio summary...";
        res.json({ response: botResponse }); // Send immediate response

        try {
          console.log("🔵 Calling portfolio API...");

          const headers = {
            "x-webhook-request": "true",
            "Content-Type": "application/json",
          };

          console.log("📤 Headers being sent:", headers);

          const portfolioResponse = await axios.post(
            "https://wealtsphere.onrender.com/api/portfolio/portfolioTotal",
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
            const { totalValue, percentages, assetValues } = portfolioResponse.data;
            finalResponse = `📊 **Your Portfolio Summary:**  
            - **Total Value:** ₹${totalValue}  
            - **Stocks:** ₹${assetValues.stockTotal} (${percentages.stock}%)  
            - **FDs:** ₹${assetValues.fdTotal} (${percentages.fd}%)  
            - **Cash:** ₹${assetValues.cashTotal} (${percentages.cash}%)  
            - **Crypto:** ₹${assetValues.cryptoTotal} (${percentages.crypto}%)  
            `;
          }

          await sendFollowUpMessage(sessionId, finalResponse);
        } catch (error) {
          console.error("❌ Error fetching portfolio:", error.message);
          await sendFollowUpMessage(sessionId, "❌ Error fetching portfolio. Please try again later.");
        }
        return;
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

// Function to send a follow-up message asynchronously
async function sendFollowUpMessage(sessionId, message) {
  console.log("🟡 Sending follow-up message:", message);
  // Implement a function to send the message back to the user
  // Example: Send via WebSocket, Push Notification, or a Chat API
}

module.exports = router;
