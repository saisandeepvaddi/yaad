function setBadge(todos) {
  if (todos === undefined) {
    todos = [];
  }
  var remainingCount = 0;

  // let nonZeroColor = "#F13030";
  let nonZeroColor = "#DB504A";
  let zeroColor = "#8FB339";

  for (var i = 0; i < todos.length; i++) {
    if (!todos[i].completed) {
      remainingCount++;
    }
  }
  chrome.browserAction.setBadgeText({ text: remainingCount.toString() });

  if (remainingCount === 0) {
    chrome.browserAction.setBadgeBackgroundColor({
      // color: "#BA5A31"
      color: zeroColor
    });
  } else if (remainingCount > 0) {
    chrome.browserAction.setBadgeBackgroundColor({
      // color: "#BA5A31"
      color: nonZeroColor
    });
  }
}

// When add-on started
chrome.storage.sync.get("yaad", function(yaad) {
  var todos = yaad.yaad;
  setBadge(todos);
});

// on every change
chrome.storage.onChanged.addListener(function(data, areaName) {
  let newTodos = data.yaad.newValue;
  setBadge(newTodos);
});
