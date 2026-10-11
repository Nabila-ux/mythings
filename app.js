let tasks = JSON.parse(localStorage.getItem('eisenhower_exact_shape_tasks')) || [
  { id: 1, text: 'Solat fardhu awal waktu', quadrant: 'schedule', completed: false },
  { id: 2, text: 'Deadline kerja hakiki', quadrant: 'do', completed: false },
  { id: 3, text: 'Serah tugasan rutin', quadrant: 'delegate', completed: false },
  { id: 4, text: 'Hadkan scroll medsos', quadrant: 'delete', completed: false }
];

const taskInput = document.getElementById('task-input');
const quadrantSelect = document.getElementById('quadrant-select');
const addBtn = document.getElementById('add-btn');

function addTask() {
  const text = taskInput.value.trim();
  const quadrant = quadrantSelect.value;

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    quadrant,
    completed: false
  });

  taskInput.value = '';
  saveAndRender();
}

function toggleTask(id) {
  tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('eisenhower_exact_shape_tasks', JSON.stringify(tasks));

  const quadrants = ['do', 'schedule', 'delegate', 'delete'];

  // Kosongkan senarai setiap kotak
  quadrants.forEach(q => {
    const listEl = document.getElementById(`list-${q}`);
    listEl.innerHTML = '';
  });

  // Render tugas ke dalam kotak masing-masing
  tasks.forEach(task => {
    const listEl = document.getElementById(`list-${task.quadrant}`);
    if (listEl) {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="task-content" onclick="toggleTask(${task.id})">
          <div class="check-dot"></div>
          <span class="task-text">${task.text}</span>
        </div>
        <button class="del-btn" onclick="deleteTask(${task.id})">&times;</button>
      `;
      listEl.appendChild(li);
    }
  });
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

saveAndRender();
