let tasks = [];
let editingIndex = null;
const ring = document.getElementById('ring');
const C = 176; 

function draw() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pending = total - done;
    const pct = total === 0 ? 0 : (done / total);
    
    // get the date
    const today = new Date().toISOString().split('T')[0];
    let hasOverdue = false;

    const list = document.getElementById('list');
    list.innerHTML = tasks.map((t, i) => {
        // this will check if it is late
        const isLate = t.date && t.date < today && !t.done;
        if (isLate) hasOverdue = true;

        // check if this task is being edited
        if (editingIndex === i) {
            return `
            <li class="editing">
                <input type="text" id="editInput" value="${t.text}" style="flex:1; padding:8px; border:2px solid var(--accent); border-radius:4px;">
                <input type="date" id="editDateInput" value="${t.date || ''}" style="padding:8px; border:2px solid var(--accent); border-radius:4px;">
                <button class="save" onclick="saveEdit(${i})">✓</button>
                <button class="cancel" onclick="cancelEdit()">✕</button>
            </li>
            `;
        }

        return `
        <li class="${t.done ? 'done' : ''} ${isLate ? 'overdue' : ''}">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggle(${i})" style="width:18px; height:18px; accent-color:var(--accent);">
            <div class="task-details">
                <span>${t.text}</span>
                <span class="task-date">${t.date || 'No Date'}</span>
            </div>
            ${isLate ? '<span class="late-badge">LATE</span>' : ''}
            <button class="edit" onclick="editTask(${i})">✎</button>
            <button class="del" onclick="remove(${i})">&times;</button>
        </li>
    `}).join('');

    // updates the dashboard
    document.getElementById('totalVal').innerText = total;
    document.getElementById('pendingVal').innerText = pending;
    document.getElementById('doneVal').innerText = done;
    document.getElementById('percVal').innerText = Math.round(pct * 100) + '%';

    ring.style.strokeDashoffset = C - (C * pct);
    
    // if any task is late, it will turn red
    if (hasOverdue) {
        ring.style.stroke = 'var(--danger)';
    } else if (pct === 1 && total > 0) {
        ring.style.stroke = 'var(--success)';
    } else {
        ring.style.stroke = 'var(--accent)';
    }

    // focus on edit input if editing
    if (editingIndex !== null) {
        setTimeout(() => {
            const editInput = document.getElementById('editInput');
            if (editInput) editInput.focus();
        }, 0);
    }
}

function addTask() {
    const txt = document.getElementById('taskInput').value.trim();
    const date = document.getElementById('dateInput').value;
    if (!txt) return;
    
    tasks.push({ text: txt, date: date, done: false });
    
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
    draw();
}

function toggle(i) { 
    tasks[i].done = !tasks[i].done; 
    draw(); 
}

function remove(i) { 
    tasks.splice(i, 1); 
    draw(); 
}

function editTask(i) {
    editingIndex = i;
    draw();
}

function saveEdit(i) {
    const newText = document.getElementById('editInput').value.trim();
    const newDate = document.getElementById('editDateInput').value;
    
    if (newText) {
        tasks[i].text = newText;
        tasks[i].date = newDate;
    }
    
    editingIndex = null;
    draw();
}

function cancelEdit() {
    editingIndex = null;
    draw();
}

draw();