// State management with LocalStorage
let tasks = JSON.parse(localStorage.getItem('eisenhower_tasks')) || [];

const taskInput = document.getElementById('task-input');
const quadrantSelect = document.getElementById('quadrant-select');
const addBtn = document.getElementById('add-btn');

function renderTasks() {
  // Clear lists
  document.getElementById('list-do').innerHTML = '';
  document.getElementById('list-schedule').innerHTML = '';
  document.getElementById('list-delegate').innerHTML = '';
  document.getElementById('list-delete').innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <button onclick="deleteTask(${index})">&times;</button>
    `;

    const targetList = document.getElementById(`list-${task.quadrant}`);
    if (targetList) {
      targetList.appendChild(li);
    }
  });

  localStorage.setItem('eisenhower_tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const quadrant = quadrantSelect.value;

  if (!text) return;

  tasks.push({ text, quadrant, completed: false });
  taskInput.value = '';
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initial Render
renderTasks();