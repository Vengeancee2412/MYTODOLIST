let tasks = [];
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
    const newText = prompt('Edit task:', tasks[i].text);
    const newDate = prompt('Edit date (YYYY-MM-DD):', tasks[i].date);
    
    if (newText !== null && newText.trim()) {
        tasks[i].text = newText.trim();
    }
    if (newDate !== null) {
        tasks[i].date = newDate;
    }
    draw();
}

draw();