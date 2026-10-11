let tasks = JSON.parse(localStorage.getItem('eisenhower_islamic_tasks')) || [];
let currentTab = 'all';

const taskInput = document.getElementById('task-input');
const quadrantSelect = document.getElementById('quadrant-select');
const addBtn = document.getElementById('add-btn');

function switchTab(tab) {
  currentTab = tab;

  // Tukar kelas aktif pada butang tab
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Papar/Sembunyi kad kuadran
  const quadrants = ['do', 'schedule', 'delegate', 'delete'];
  quadrants.forEach(q => {
    const card = document.getElementById(`card-${q}`);
    if (tab === 'all' || tab === q) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

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
  localStorage.setItem('eisenhower_islamic_tasks', JSON.stringify(tasks));

  const quadrants = ['do', 'schedule', 'delegate', 'delete'];
  let counts = { do: 0, schedule: 0, delegate: 0, delete: 0 };

  // Kosongkan senarai sebelum render
  quadrants.forEach(q => {
    const listEl = document.getElementById(`list-${q}`);
    listEl.innerHTML = '';
  });

  tasks.forEach(task => {
    counts[task.quadrant]++;
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

  // Kemaskini jumlah & nombor lencana (Badges)
  document.getElementById('badge-do').textContent = counts.do;
  document.getElementById('header-count-do').textContent = counts.do;

  document.getElementById('badge-schedule').textContent = counts.schedule;
  document.getElementById('header-count-schedule').textContent = counts.schedule;

  document.getElementById('badge-delegate').textContent = counts.delegate;
  document.getElementById('header-count-delegate').textContent = counts.delegate;

  document.getElementById('badge-delete').textContent = counts.delete;
  document.getElementById('header-count-delete').textContent = counts.delete;

  document.getElementById('total-count').textContent = `${tasks.length} Tugas`;
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Render kali pertama
saveAndRender();
