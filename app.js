const KEY = 'my-notes';

const noteInput = document.getElementById('note');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const checkBtn = document.getElementById('checkBtn');
const statusText = document.getElementById('status');
const notesList = document.getElementById('notesList');

function getNotes() {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function saveNotes(notes) {
    localStorage.setItem(KEY, JSON.stringify(notes));
}

function renderNotes() {
    const notes = getNotes();
    notesList.innerHTML = '';
    
    notes.forEach((text, i) => {
        const li = document.createElement('li');
        li.textContent = text;
        
        const del = document.createElement('button');
        del.textContent = 'Удалить';
        del.onclick = () => {
            const updated = getNotes();
            updated.splice(i, 1);
            saveNotes(updated);
            renderNotes();
        };
        
        li.appendChild(del);
        notesList.appendChild(li);
    });
}

window.addEventListener('load', () => {
    renderNotes();
});

saveBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (!text) return;
    
    const notes = getNotes();
    notes.push(text);
    saveNotes(notes);
    noteInput.value = '';
    renderNotes();
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    noteInput.value = '';
    renderNotes();
});

// Регистрация Service Worker для офлайн-работы (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./sw.js')
        .then(() => {
            console.log('Service Worker зарегистрирован');
            // Проверяем сеть после регистрации SW
            fetch('https://jsonplaceholder.typicode.com/posts/1')
                .then(response => response.json())
                .then(data => console.log('Пост 1:', data))
                .catch(error => console.error('Ошибка сети:', error));
        })
        .catch(error => console.error('Ошибка SW:', error));
}

checkBtn.addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/posts/3')
        .then(response => response.json())
        .then(data => {
            console.log('Пост 3:', data);
            statusText.textContent = 'Сеть работает ✅';
        })
        .catch(error => {
            console.error('Ошибка сети:', error);
            statusText.textContent = 'Нет сети ❌';
        });
});