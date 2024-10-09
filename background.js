console.log("Background script loaded");

chrome.commands.onCommand.addListener((command) => {
  console.log("Command received:", command);
  if (command === "new-chat-tab") {
    chrome.tabs.create({ url: "https://claude.ai/new" });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.runtime.lastError) {
        console.error("Error querying tabs:", chrome.runtime.lastError);
        return;
      }
      if (tabs.length === 0) {
        console.error("No active tab found");
        return;
      }
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: command },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else if (response && response.status === "success") {
            console.log("Message sent successfully, response:", response);
          } else {
            console.error("Unexpected response:", response);
          }
        }
      );
    });
  }
});
