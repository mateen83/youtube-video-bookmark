
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCurrentTime') {
    const player = document.querySelector('video');
    const currentTime = player ? player.currentTime : null;
    sendResponse({ currentTime });
  }
});
