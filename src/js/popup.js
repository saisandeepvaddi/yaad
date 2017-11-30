function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

var removeTodo = function(todo) {};

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
  var item = $(
    "<div class='todo-element'>" +
      "<b>&CenterDot;</b>&nbsp;&nbsp;" +
      todo.data +
      "</div>"
  ).click(function() {
    var id = todo.id;
    todo.completed = !todo.completed;
    if (todo.completed) {
      $(item).css("text-decoration", "line-through");
    } else {
      $(item).css("text-decoration", "none");
    }
    chrome.storage.sync.get("yaad", function(yaad) {
      var todos = yaad.yaad;
      var index = -1;
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          index = i;
          break;
        }
      }
      todos.splice(index, 1);
      todos.splice(index, 0, todo);
      chrome.storage.sync.set({ yaad: todos }, function() {
        console.log("Todo Deleted");
      });
    });
  });

  if (todo.completed) {
    $(item).css("text-decoration", "line-through");
  } else {
    $(item).css("text-decoration", "none");
  }

  var deleteButton = $(
    '<div><i class="tiny material-icons red">close</i><div>'
  ).click(function() {
    var id = todo.id;
    $(this)
      .parent()
      .remove();
    chrome.storage.sync.get("yaad", function(yaad) {
      var todos = yaad.yaad;
      var index = -1;
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          index = i;
          break;
        }
      }
      todos.splice(index, 1);
      chrome.storage.sync.set({ yaad: todos }, function() {
        console.log("Todo Deleted");
      });
    });
  });

  todoItemContainer.append(item).append(deleteButton);
  return todoItemContainer;
};

$(document).ready(function() {
  $(".todo-input").focus();
  // Get saved todos
  chrome.storage.sync.get("yaad", function(yaad) {
    var todoContainer = $(".container");
    var todos = yaad.yaad;
    todos.forEach(function(todo) {
      var todoRow = createToDoRow(todo);
      todoContainer.append(todoRow);
    });
  });

  $(".todo-form").submit(function(e) {
    e.preventDefault();
    var todoText = $(".todo-input").val();
    if (todoText.trim() === "") {
      return;
    }
    var todo = {
      id: uuid(),
      data: todoText,
      completed: false
    };
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
