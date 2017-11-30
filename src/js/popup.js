var removeTodo = function() {
  $(this)
    .parent()
    .remove();
};

var strikeoutTodo = function() {
  var isLineThough = $(this).css("text-decoration");
  if (isLineThough.split(" ").includes("line-through")) {
    $(this).css("text-decoration", "none");
  } else {
    $(this).css("text-decoration", "line-through");
  }
};

var createToDoRow = function(todo) {
  var todoItemContainer = $("<div class='todo-item'></div>");
  var item = $("<div class='todo-element'>" + todo + "</div>").click(
    strikeoutTodo
  );
  var deleteButton = $(
    '<div><i class="tiny material-icons red">close</i><div>'
  ).click(removeTodo);
  todoItemContainer.append(item).append(deleteButton);

  return todoItemContainer;
};

$(document).ready(function() {
  $(".todo-input").focus();
  // Get saved todos
  chrome.storage.sync.get("yaad", function(yaad) {
    var todoContainer = $(".container");
    console.log(yaad.yaad);
    var todos = yaad.yaad;
    todos.forEach(function(todo) {
      var todoRow = createToDoRow(todo);
      todoContainer.append(todoRow);
    });
  });

  $(".todo-form").submit(function(e) {
    e.preventDefault();
    var todo = $(".todo-input").val();
    var todoRow = createToDoRow(todo);
    $(".container").append(todoRow);
    chrome.storage.sync.get("yaad", function(yaad) {
      var todos = yaad.yaad;
      todos.push(todo);
      chrome.storage.sync.set({ yaad: todos }, function() {
        console.log("Todo saved");
      });
    });
    $(".todo-input").val("");
  });
});

// Write all your code above this line. This will reload popup js page in developer tools -> sources when you reload extension from chrome://extensions.
// To avoid executing location.reload(true) in Inspect console to make popup.js appear in developer tools sources
var reload = (function() {
  var executedAlready = false;
  return function() {
    if (!executedAlready) {
      location.reload(true);
      executedAlready = true;
    }
  };
})();
