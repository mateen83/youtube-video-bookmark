
document.addEventListener('DOMContentLoaded', () => {
  const bookmarkButton = document.getElementById('bookmarkButton');
  const bookmarksList = document.getElementById('bookmarksList');

  bookmarkButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes('youtube.com/watch')) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => document.querySelector('video').currentTime,
          },
          (results) => {
            const currentTime = results[0].result;
            const bookmark = {
              title: tab.title,
              url: tab.url,
              time: currentTime,
            };
            chrome.runtime.sendMessage({ action: 'bookmark', bookmark }, (response) => {
              if (response.status === 'success') {
                displayBookmarks();
              }
            });
          }
        );
      }
    });
  });

  function displayBookmarks() {
    chrome.storage.local.get('bookmarks', (data) => {
      const bookmarks = data.bookmarks || [];
      bookmarksList.innerHTML = '';
      bookmarks.forEach((bookmark, index) => {
        const li = document.createElement('li');
        li.textContent = `${bookmark.title} - ${formatTime(bookmark.time)}`;
        li.addEventListener('click', () => {
          chrome.tabs.create({ url: `${bookmark.url}&t=${Math.floor(bookmark.time)}s` });
        });
        bookmarksList.appendChild(li);
      });
    });
  }

  function formatTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  displayBookmarks();
});
