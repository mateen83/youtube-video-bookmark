
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ bookmarks: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'bookmark') {
    chrome.storage.local.get('bookmarks', (data) => {
      const bookmarks = data.bookmarks || [];
      bookmarks.push(message.bookmark);
      chrome.storage.local.set({ bookmarks });
      sendResponse({ status: 'success' });
    });
    return true;
  }
});
