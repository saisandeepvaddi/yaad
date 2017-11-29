var removeTodo = function() {
  $(this)
    .parent()
    .parent()
    .parent()
    .remove();
};

var createToDoRow = function(todo) {
  var row = $("<div class='row'></div>");
  var span = $("<span></span>");
  var deleteButton = $(
    "<button class='todo-remove-button'>&times;</button>"
  ).click(removeTodo);
  var inButton = span.append(deleteButton);
  var item = $("<div class='col s12 todo-element'>" + todo + "</div>");
  var buttonAddedItem = item.append(inButton);
  return row.append(buttonAddedItem);
};

$(document).ready(function() {
  $(".todo-input").focus();

  $(".todo-form").submit(function(e) {
    e.preventDefault();
    console.log("Submitted");
    var todo = $(".todo-input").val();
    var todoRow = createToDoRow(todo);
    $(".todo-container").append(todoRow);
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
