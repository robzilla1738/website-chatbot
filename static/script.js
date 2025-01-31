const chatWindow = document.getElementById("chat-window");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.querySelector("#chat-input button");

// Function to toggle chat visibility
function toggleChat() {
  chatWindow.classList.toggle("hidden");
}

// Ensure chat starts closed
document.addEventListener("DOMContentLoaded", () => {
  chatWindow.classList.add("hidden");
});

// Open chat when clicking the chat bubble
document.getElementById("chat-bubble").addEventListener("click", () => {
  chatWindow.classList.remove("hidden");
});

// Close chat when clicking the X button
document.querySelector("#chat-header button").addEventListener("click", () => {
  chatWindow.classList.add("hidden");
});

// Function to show typing indicator
function showTypingIndicator() {
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message", "typing-indicator");
  typingIndicator.innerHTML = "<span>.</span><span>.</span><span>.</span>";
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingIndicator;
}

// Function to remove typing indicator
function removeTypingIndicator(typingIndicator) {
  if (typingIndicator) {
    chatMessages.removeChild(typingIndicator);
  }
}

// Function to send message
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessageToChat("User", message);
  userInput.value = "";

  // Show typing animation
  const typingIndicator = showTypingIndicator();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    removeTypingIndicator(typingIndicator);

    data.reply
      ? addMessageToChat("Bot", data.reply)
      : addMessageToChat("Bot", "No response from server");
  } catch (err) {
    removeTypingIndicator(typingIndicator);
    addMessageToChat("Bot", "Unable to reach the server.");
  }
}

// Function to add messages to chat UI
function addMessageToChat(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "User" ? "user-message" : "bot-message");
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Listen for Enter key to send messages
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// Listen for Send button click
sendButton.addEventListener("click", sendMessage);
