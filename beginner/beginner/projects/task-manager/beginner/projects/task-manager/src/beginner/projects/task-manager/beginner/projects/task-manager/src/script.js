// Get form and input elements
const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categoryInput = document.getElementById("category");
const dueDateInput = document.getElementById("due-date");
const taskLists = document.querySelectorAll(".task-list");

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to local storage
function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks to the page
function renderTasks() {
taskLists.forEach(list => list.innerHTML = "");

tasks.forEach((task, index) => {
const li = document.createElement("li");
li.className = "task-item";
if (task.completed) li.classList.add("completed");
li.draggable = true;
li.dataset.index = index;

  li.innerHTML = `
  <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})" />
  <span>${task.text}</span>
  <div class="meta">${task.dueDate || "No date"}</div>
  <button onclick="editTask(${index})">Edit</button>
 <button onclick="deleteTask(${index})">Delete</button>
   `;

const list = document.querySelector(\`.task-list[data-category="\${task.category}"]\`);
if (list) list.appendChild(li);
});
}

// Handle form submission
form.addEventListener("submit", (e) => {
e.preventDefault();

const newTask = {
text: taskInput.value.trim(),
category: categoryInput.value,
dueDate: dueDateInput.value,
completed: false,
 };

 if (newTask.text === "") return;

 tasks.push(newTask);
 saveTasks();
 renderTasks();
 form.reset();
});

// Delete a task
function deleteTask(index) {
 tasks.splice(index, 1);
 saveTasks();
 renderTasks();
}

// Edit a task
function editTask(index) {
 const task = tasks[index];
 taskInput.value = task.text;
 categoryInput.value = task.category;
 dueDateInput.value = task.dueDate;
 deleteTask(index);
}

// Toggle task completion
function toggleComplete(index) {
 tasks[index].completed = !tasks[index].completed;
 saveTasks();
 renderTasks();
}

// Drag and drop functionality
taskLists.forEach(list => {
list.addEventListener("dragover", e => e.preventDefault());

list.addEventListener("drop", e => {
const draggedIndex = e.dataTransfer.getData("text/plain");
const newCategory = list.dataset.category;
tasks[draggedIndex].category = newCategory;
saveTasks();
renderTasks();
 });
});

document.addEventListener("dragstart", e => {
 if (e.target.classList.contains("task-item")) {
e.dataTransfer.setData("text/plain", e.target.dataset.index);
 }
});

// Initial render
renderTasks();
