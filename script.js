// Hosting the frontend on GitHub Pages requires a static approach, so let's simulate real-time heart rate data
// using JavaScript on the client side. We will establish a connection to the Realtime API from a hosted page.

// Mock Data Configuration
function generateMockHeartRate() {
  return Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Generate random heart rate between 60 and 100 BPM
}
let currentHeartRateIndex = 0;

// Encrypted access token
const encryptedAccessToken =
  "c2stcHJvai1oU1lqSVZGYjZ3QS1XX2RkVHV1SlVmaDNzRDltRGhHUlU4cFlfMldZdEVlTXFNVHU4TjJ6V2tGcno0Y3paUGhhOC1PRGhEaS1TZ1QzQmxia0ZKUkJfT1RHelpnTGdKM2MteHhEeFF4OVhGMWFZMDR3U2xVRlhsbW9MNEdnOWw2bFB5bllWRjJmSTRTYmRzWFgyWWQwV1g5bUVjb0E=";

let ws;

// Function to Establish WebSocket Connection to Realtime API
function startWebSocketConnection() {
  const url =
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
  ws = new WebSocket(url, {
    headers: {
      Authorization: "Bearer " + atob(encryptedAccessToken),
      "OpenAI-Beta": "realtime=v1",
    },
  });

  ws.on("open", function open() {
    console.log("Connected to Realtime API.");
    document.getElementById("status").innerText = "Connected";
    startMockHeartRateStream();
  });

  ws.on("message", function incoming(message) {
    try {
      const event = JSON.parse(message.toString());
      if (event.type === "response.create") {
        console.log("Response received:", event);
        handleVoiceResponse(event);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("error", function error(err) {
    console.error("WebSocket error:", err);
    document.getElementById("status").innerText = "Connection Error";
  });

  ws.on("close", function close() {
    console.log("Disconnected from Realtime API.");
    document.getElementById("status").innerText = "Disconnected";
  });
}

// Function to Simulate Heart Rate Data Streaming
function startMockHeartRateStream() {
  setInterval(() => {
    const heartRate = generateMockHeartRate();
    sendHeartRateUpdate(heartRate);
  }, 5000); // Send an update every 5 seconds
}

// Function to Send Heart Rate Update to Realtime API
function sendHeartRateUpdate(heartRate) {
  const heartRateEvent = {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "system",
      content: [
        {
          type: "text",
          text: `User's current heart rate is ${heartRate} BPM. Adjust tone to calm if above 80 BPM.`,
        },
      ],
    },
  };
  try {
    ws.send(JSON.stringify(heartRateEvent));
  } catch (error) {
    console.error("Error sending heart rate update:", error);
  }
}

// Function to Handle Voice Responses Based on Heart Rate
function handleVoiceResponse(response) {
  const heartRate = generateMockHeartRate();
  if (heartRate > 80) {
    console.log("Heart rate is elevated. Responding with a calming tone.");
    // Modify the voice tone or play a calming message here
  } else {
    console.log("Heart rate is stable. Maintaining normal voice tone.");
  }
}
