const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");
const quoteBox = document.getElementById("quote");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let focusMode = false;

// 💬 Motivational Quotes
const quotes = [
  '"Focus on being productive instead of busy." – Tim Ferriss',
  '"It always seems impossible until it’s done." – Nelson Mandela',
  '"Don’t watch the clock; do what it does. Keep going." – Sam Levenson',
  '"Your future is created by what you do today." – Robert Kiyosaki',
  '"The key is not to prioritize what’s on your schedule, but to schedule your priorities." – Stephen Covey'
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function renderTasks() {
  taskList.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  let filteredTasks = tasks.filter(task => {
    const taskText = (task.text || "").toLowerCase(); // ✅ Safe fallback
    const matchesSearch = taskText.includes(keyword);

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.done) ||
      (filter === "done" && task.done) ||
      (filter === "high" && task.priority === "high");

    return matchesSearch && matchesFilter;
  });

  if (focusMode) filteredTasks = filteredTasks.slice(0, 1);

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.done ? "done" : ""}`;

    const span = document.createElement("span");
    span.innerHTML = `
      <strong>${task.text}</strong><br />
      <small>🗓 ${task.dueDate || "No date"} | 🔺 ${task.priority}</small>
    `;

    const btns = document.createElement("div");
    btns.className = "task-buttons";

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = task.done ? "✔️" : "✅";
    doneBtn.onclick = () => toggleDone(index);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "❌";
    delBtn.className = "delete";
    delBtn.onclick = () => deleteTask(index);

    btns.appendChild(doneBtn);
    btns.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(btns);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (!text || text.length < 1) {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    text,
    priority,
    dueDate,
    done: false
  });

  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "medium";
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleFocusMode() {
  focusMode = !focusMode;
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
  }
}

// ✅ Init
renderTasks();
loadTheme();
quoteBox.innerText = getRandomQuote();
