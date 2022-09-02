// ----------------------------------------------------------------------------
// The code here is based on an example by CodingNepal - youtube.com/codingnepal
// the link to the tutorial thats used is as follows:
// https://www.codingnepalweb.com/create-todo-list-app-html-javascript/ 
// Note that code that was provided on the website was imported to satisfy the assingment requirments */
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Variable Definition to be used across functions and main execution code
// ----------------------------------------------------------------------------
// This finds the div elemets in the html document and converts it to js objects (variable, lists and etc.) 
// so that logic can be executed accordingly upon them
const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list")); // todos is the browser storage to retain all the tasks
// ****************************************************************************

// ----------------------------------------------------------------------------
// Whenver the ... ellipssis beside a task is clicked, this method gets executed.
// ----------------------------------------------------------------------------
function showMenu(selectedTask) {
    // Since this method is called wihtin the <li> tag, its able to get parent informatoin of the task in which it resides
    let menuDiv = selectedTask.parentElement.lastElementChild;
    // Shown the task menu item
    menuDiv.classList.add("show");
    // whenever the user clicks somewhere that is not in the task menu, it removes it from view
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}
// ****************************************************************************

// ----------------------------------------------------------------------------
// Whenver a checkbox beside a task is clicked, this method gets executed.
// ----------------------------------------------------------------------------
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}
// ****************************************************************************

// ----------------------------------------------------------------------------
// Runs this method whenever the user clicks on the edit button in the task menu
// ----------------------------------------------------------------------------
function editTask(taskId, textName) {
// Makes sure the documents knows they are currenlty in edit mode. So that other methods like eventListeners waitinf for Enter
// know how to deal with the change.
    editId = taskId;
    isEditTask = true;
// Populated the textbox with the name of the task passed in through the HTML <li tag
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}
// ****************************************************************************

// ----------------------------------------------------------------------------
// Runs this method whenever the user clicks on the edit button in the task menu
// Removed the task from local storage (todos) by taking in the taskId refrence that is passed through the HTML <li tag below
// ----------------------------------------------------------------------------
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}
// ****************************************************************************

// ----------------------------------------------------------------------------
//this method gets executed whenever the task view pane needs to be repopulated
// It is called by other methods within this javascript file and not an HTML tag
// ----------------------------------------------------------------------------
function showTodo(filter) {
    let liTag = "";
    if(todos) {
        // for every task thats in todos, we populate a list item in HTML
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                // In the list tag: The check box is linked to the updateStatus method above and passes the task it resides in as a parameter
                // The task itself is shown in a paragraph tag
                // The ... ellipsis are shown and then linked to the showMenu method above to execute upon a click
                // The edit button inside the menu is linked to the editTask method above to execute upon a click
                // The delete button inside the menu is linked to the deleteTask method above to execute upon a click
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    // This is where the javascript updates the HTML document
    // If no tasks in memory, then a default message is shown
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    // This sets the overflow when the number of tasks in over the task box pane of 300px. This enables the user to scroll
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
// ****************************************************************************

// ----------------------------------------------------------------------------
// For each of the filter button, a listener is programmatically added
// ----------------------------------------------------------------------------
filters.forEach(btn => {
// Whenever any of the 'filter' buttons are clicked, the respective listener is executed
    btn.addEventListener("click", () => {
        // the listener changes the active button from what it was previously to the button that was currenlty clicked
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        // either 'all', 'pending', or 'completed' is passed to the showToDo to update the task view pane accordingly
        showTodo(btn.id);
    });
});
// ****************************************************************************

// ----------------------------------------------------------------------------
// Whenever the 'clear all' button is clicked, this listener is executed
// This clears the todos browser memory storage and repopulates the task view pane by 
// calling the showTodo.
// ----------------------------------------------------------------------------
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});
// ****************************************************************************

// ----------------------------------------------------------------------------
// When ever there is a keyboard key pressed/released in the input text bar, this 
// method gets executed (b/c its listening to those events)
// ----------------------------------------------------------------------------
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            // When user enters a new task
            todos = !todos ? [] : todos; // check is todos is empty, if so, then its equal to an empty array othterwise its 
            // equal to the todos thats in browser memory
            let taskInfo = {name: userTask, status: "pending"}; //dictionary of tasks in browser storage
            todos.push(taskInfo);//adds the task to the array to populate the front end
        } else {
            // when User is done editing a previous entered task
            isEditTask = false;
            todos[editId].name = userTask;//updates the name of the task your updated 
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});
// ****************************************************************************


//This is the line that executes to populate all the tasks at time = 0s (at the beginning)
showTodo("all");

