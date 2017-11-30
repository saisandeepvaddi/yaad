var removeTodo = function() {
  $(this)
    .parent()
    .remove();
};

var createToDoRow = function(todo) {
  var todoItemContainer = $("<div class='todo-item'></div>");
  var item = $("<div class='todo-element'>" + todo + "</div>");
  var deleteButton = $(
    '<div><i class="tiny material-icons red">close</i><div>'
  ).click(removeTodo);
  todoItemContainer.append(item).append(deleteButton);

  return todoItemContainer;
};

$(document).ready(function() {
  $(".todo-input").focus();

  $(".todo-form").submit(function(e) {
    e.preventDefault();
    console.log("Submitted");
    var todo = $(".todo-input").val();
    var todoRow = createToDoRow(todo);
    $(".container").append(todoRow);
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
