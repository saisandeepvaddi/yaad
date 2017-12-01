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
////////// ======================== Start ======================/////
function clearDone() {
  chrome.storage.sync.get("yaad", function(yaad) {
    let activeTodos = yaad.yaad;
    if (activeTodos === undefined) {
      activeTodos = [];
    }
    console.log("Current: ");
    console.log(activeTodos);

    let newTodos = [];

    for (let i = 0; i < activeTodos.length; i++) {
      if (!activeTodos[i].completed) {
        // activeTodos.splice(i, 1);
        newTodos.push(activeTodos[i]);
      }
    }

    chrome.storage.sync.remove("yaad", function() {
      chrome.storage.sync.set({ yaad: newTodos }, function() {
        console.log("New: ");
        console.log(newTodos);
        console.log("Done to-dos deleted");
        $(".container")
          .find(".todo-item")
          .remove();
        newTodos.forEach(function(todo) {
          if (!todo.completed) {
            let todoRow = createToDoRow(todo);
            $(".container").append(todoRow);
          }
        });
      });
    });
  });
}

function strikeoutTodo() {
  let isLineThough = $(this).css("text-decoration");
  if (isLineThough.split(" ").includes("line-through")) {
    $(this).css("text-decoration", "none");
  } else {
    $(this).css("text-decoration", "line-through");
  }
}

function createToDoRow(todo) {
  let todoItemContainer = $("<div class='todo-item'></div>");
  let item = $(
    "<div class='todo-element'>" +
      "<b>&rtrif;</b>&nbsp;&nbsp;" +
      "<span class='todo-data'>" +
      todo.data +
      "</span>" +
      "</div>"
  ).click(function() {
    let id = todo.id;
    todo.completed = !todo.completed;
    if (todo.completed) {
      $(item)
        .find("span.todo-data")
        .css("text-decoration", "line-through");
    } else {
      $(item)
        .find("span.todo-data")
        .css("text-decoration", "none");
    }
    chrome.storage.sync.get("yaad", function(yaad) {
      let todosBeforeStrike = yaad.yaad;
      let index = -1;
      for (let i = 0; i < todosBeforeStrike.length; i++) {
        if (todosBeforeStrike[i].id === id) {
          index = i;
          break;
        }
      }

      let newTodo = Object.assign({}, todo, {
        completed: todo.completed
      });
      todosBeforeStrike.splice(index, 1);
      todosBeforeStrike.splice(index, 0, newTodo);
      chrome.storage.sync.set({ yaad: todosBeforeStrike }, function() {
        console.log("Todo Status Changed");
        // setTodoCount();
      });
    });
  });

  if (todo.completed) {
    $(item)
      .find("span.todo-data")
      .css("text-decoration", "line-through");
  } else {
    $(item)
      .find("span.todo-data")
      .css("text-decoration", "none");
  }

  let deleteButton = $(
    '<div class="delete-div"><i class="tiny material-icons red">close</i><div>'
  ).click(function() {
    let id = todo.id;
    $(this)
      .parent()
      .remove();
    chrome.storage.sync.get("yaad", function(yaad) {
      let todosBeforeDelete = yaad.yaad;
      let index = -1;
      for (let i = 0; i < todosBeforeDelete.length; i++) {
        if (todosBeforeDelete[i].id === id) {
          index = i;
          break;
        }
      }
      todosBeforeDelete.splice(index, 1);
      chrome.storage.sync.set({ yaad: todosBeforeDelete }, function() {
        console.log("Todo Deleted");
      });
    });
  });

  todoItemContainer.append(item).append(deleteButton);
  return todoItemContainer;
}
////////// ======================== End ======================/////

$(document).ready(function() {
  $(".todo-input").focus();
  $(".clear-done-button").on("click", clearDone);
  // Get saved todos
  chrome.storage.sync.get("yaad", function(yaad) {
    let todoContainer = $(".container");
    let savedTodos = yaad.yaad;
    if (savedTodos === undefined) {
      savedTodos = [];
    }
    savedTodos.forEach(function(todo) {
      let todoRow = createToDoRow(todo);
      todoContainer.append(todoRow);
    });
  });

  $(".todo-form").submit(function(e) {
    e.preventDefault();
    let todoText = $(".todo-input").val();
    if (todoText.trim() === "") {
      return;
    }
    let todo = {
      id: uuid(),
      data: todoText,
      completed: false
    };
    let todoRow = createToDoRow(todo);
    $(".container").append(todoRow);
    chrome.storage.sync.get("yaad", function(yaad) {
      let todosWithNewOne = yaad.yaad;
      if (todosWithNewOne === undefined) {
        todosWithNewOne = [];
      }
      todosWithNewOne.push(todo);
      chrome.storage.sync.set({ yaad: todosWithNewOne }, function() {
        console.log("Todo saved");
      });
    });
    $(".todo-input").val("");
  });
});

// Write all your code above this line. This will reload popup js page in developer tools -> sources when you reload extension from chrome://extensions.
// To avoid executing location.reload(true) in Inspect console to make popup.js appear in developer tools sources
let reload = (function() {
  let executedAlready = false;
  return function() {
    if (!executedAlready) {
      location.reload(true);
      executedAlready = true;
    }
  };
})();
