const taskinput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const quoteElement = document.getElementById("quote");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-theme");
    themeToggle.innerHtml='<i data-lucide="sun"></i>';
}

lucide.createIcons();

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
        ${task.text}
            <div>
                <button class="complete-btn" data-index="${index}">✔</button>
                <button class="delete-btn" data-index="${index}">✖</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask(){
    const text = taskinput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        taskinput.value = "";
        saveTasks();
        renderTasks();
    } else {
        alert("Please enter a task");
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

taskList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("complete-btn")) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    } else if (e.target.classList.contains("delete-btn")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
});

addTaskBtn.addEventListener("click", addTask);

taskinput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    themeToggle.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`
    lucide.createIcons();

    localStorage.setItem("theme", isDark ? "dark" : "light");
});


async function loadQuote() {
    try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        quoteElement.textContent = `"${data.content}" - ${data.author}`;
    } catch (err) {
        quoteElement.textContent = "Stay motivated!";
    }
}

renderTasks();
loadQuote();
