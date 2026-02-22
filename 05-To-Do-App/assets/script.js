// Add the To-Do
const addTodo = () => {
    const todo = document.getElementById("todo").value.trim();
    if (!todo) {
        return;
    }

    //Add new To-Do to the List
    todos.push({ text: todo, completed: false });
    document.getElementById("todo").value = "";
    saveTodos();
    renderTodos();
};

// Edit The Text-Content of To-Do
const editTodo = (todo) => {
    const newText = prompt("Edit todo:", todo.text);
    if (newText !== null && newText.trim() !== "") {
        todo.text = newText.trim();
        textSpan.textContent = todo.text;
    }
};

// Delete the To-Do
const deleteTodo = (index) => {
    todos.splice(index, 1);
};

//Adding Todos to LocalStorage
const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Create a DOM node for a todo item
const createTodoNode = (todo) => {
    const li = document.createElement("li");
    li.className = "todo";

    // Checkbox to mark To-Do as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
    });
    li.appendChild(checkbox);

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;
    if (todo.completed) {
        textSpan.style.fontStyle = "italic";
        textSpan.style.textDecoration = "line-through";
        textSpan.style.color = "firebrick";
    }

    //Add Double click event to edit To-Do
    textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit todo:", todo.text);
        if (newText !== null && newText.trim() !== "") {
            todo.text = newText.trim();
            textSpan.textContent = todo.text;
            saveTodos();
        }
    });
    li.appendChild(textSpan);

    //Delete To-Do Button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteTodo();
        saveTodos();
        renderTodos();
    });
    li.appendChild(deleteButton);

    return li;
};

// Render the list of todos to the DOM
const renderTodos = () => {
    const list = document.getElementById("todo-list");
    list.innerHTML = "";
    todos.forEach((todo, index) => {
        const todoNode = createTodoNode(todo, index);
        list.appendChild(todoNode);
    });
};

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
    renderTodos();
});

const saved = localStorage.getItem("todos");
const todos = saved ? JSON.parse(saved) : [];
renderTodos();
