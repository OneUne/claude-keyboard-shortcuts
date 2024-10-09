// content.js

console.log("Claude.ai Keyboard Shortcuts content script loaded");

function showFeedback(message) {
  const feedback = document.createElement("div");
  feedback.textContent = message;
  feedback.style.position = "fixed";
  feedback.style.bottom = "20px";
  feedback.style.right = "20px";
  feedback.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  feedback.style.color = "white";
  feedback.style.padding = "10px";
  feedback.style.borderRadius = "5px";
  feedback.style.zIndex = "9999";

  document.body.appendChild(feedback);

  setTimeout(() => {
    document.body.removeChild(feedback);
  }, 2000);
}

function clickCopyButton() {
  const copyButtons = Array.from(document.querySelectorAll("button")).filter(
    (button) => button.textContent.trim() === "Copy"
  );

  if (copyButtons.length > 0) {
    copyButtons[copyButtons.length - 1].click();
    console.log("Copy button clicked");
    showFeedback("Content copied!");
    return true;
  } else {
    console.log("No copy button found");
    showFeedback("No copyable content found");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request && request.action) {
    switch (request.action) {
      case "new-chat":
        console.log("New chat shortcut pressed");
        window.location.href = "https://claude.ai/new";
        sendResponse({ status: "success", message: "Navigated to new chat" });
        break;
      case "copy-content":
        console.log("Copy content shortcut pressed");
        const copied = clickCopyButton();
        sendResponse({
          status: "success",
          message: copied ? "Content copied" : "No content to copy",
        });
        break;
      case "new-chat-tab":
        console.log("New chat in new tab shortcut pressed");
        sendResponse({
          status: "success",
          message: "Opening new chat in new tab",
        });
        break;
      default:
        console.log("Unknown action:", request.action);
        sendResponse({ status: "error", message: "Unknown action" });
    }
  } else {
    console.error("Invalid message format");
    sendResponse({ status: "error", message: "Invalid message format" });
  }
  return true; // Indicates that the response will be sent asynchronously
});
