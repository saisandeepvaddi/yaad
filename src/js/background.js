chrome.storage.sync.get("yaad", function(yaad) {
  var todos = yaad.yaad;
  var remainingCount = 0;
  for (var i = 0; i < todos.length; i++) {
    if (!todos[i].completed) {
      remainingCount++;
    }
  }
  chrome.browserAction.setBadgeText({ text: remainingCount.toString() });
});
