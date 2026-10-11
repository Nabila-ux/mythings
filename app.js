let tasks = JSON.parse(localStorage.getItem('islamic_matrix_tasks')) || [
  { id: 1, text: 'Solat fardhu di awal waktu', quadrant: 'schedule', completed: false },
  { id: 2, text: 'Selesaikan amanah kerja/deadline', quadrant: 'do', completed: false }
];
let currentTab = 'all';

const taskInput = document.getElementById('task-input');
const quadrantSelect = document.getElementById('quadrant-select');
const addBtn = document.getElementById('add-btn');

function switchTab(tab) {
  currentTab = tab;

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const quadrants = ['do', 'schedule', 'delegate', 'delete'];
  quadrants.forEach(q => {
    const card = document.getElementById(`card-${q}`);
    card.style.display = (tab === 'all' || tab === q) ? 'block' : 'none';
  });
}

function addTask(customText = null, customQuad = null) {
  const text = customText || taskInput.value.trim();
  const quadrant = customQuad || quadrantSelect.value;

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    quadrant,
    completed: false
  });

  if (!customText) taskInput.value = '';
  saveAndRender();
}

function addPreset(text, quadrant) {
  addTask(text, quadrant);
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
  localStorage.setItem('islamic_matrix_tasks', JSON.stringify(tasks));

  const quadrants = ['do', 'schedule', 'delegate', 'delete'];
  let counts = { do: 0, schedule: 0, delegate: 0, delete: 0 };
  let completedCount = 0;

  quadrants.forEach(q => {
    const listEl = document.getElementById(`list-${q}`);
    listEl.innerHTML = '';
  });

  tasks.forEach(task => {
    counts[task.quadrant]++;
    if (task.completed) completedCount++;

    const listEl = document.getElementById(`list-${task.quadrant}`);
    if (listEl) {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="task-content" onclick="toggleTask(${task.id})">
          <div class="check-circle"></div>
          <span class="task-text">${task.text}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">&times;</button>
      `;
      listEl.appendChild(li);
    }
  });

  // Kemaskini jumlah
  document.getElementById('badge-do').textContent = counts.do;
  document.getElementById('count-do').textContent = counts.do;
  document.getElementById('badge-schedule').textContent = counts.schedule;
  document.getElementById('count-schedule').textContent = counts.schedule;
  document.getElementById('badge-delegate').textContent = counts.delegate;
  document.getElementById('count-delegate').textContent = counts.delegate;
  document.getElementById('badge-delete').textContent = counts.delete;
  document.getElementById('count-delete').textContent = counts.delete;

  document.getElementById('total-count').textContent = `${tasks.length} Amal`;

  // Status Muhasabah
  const statusEl = document.getElementById('muhasabah-status');
  if (tasks.length === 0) {
    statusEl.textContent = 'Mula rancang amal keutamaan hari ini';
  } else if (completedCount === tasks.length) {
    statusEl.textContent = 'Alhamdulillah, semua amanah selesai!';
  } else {
    statusEl.textContent = `${completedCount} daripada ${tasks.length} amal selesai`;
  }
}

addBtn.addEventListener('click', () => addTask());
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

saveAndRender();
