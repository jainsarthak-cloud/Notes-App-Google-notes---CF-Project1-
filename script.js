// DOM Elements
const addBtn = document.getElementById("addBtn");
const noteModal = document.getElementById("noteModal");
const cancelBtn = document.getElementById("cancelBtn");
const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

// Variables
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentSortOrder = "newest"; // 'newest' or 'oldest'

// Save to localStorage
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Render notes
function renderNotes(filteredNotes = notes) {
    notesContainer.innerHTML = "";

    // Sorting logic
    filteredNotes.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        if (currentSortOrder === "newest") {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = `<p class="text-center text-gray-600 col-span-full">No notes yet ✨</p>`;
        return;
    }

    filteredNotes.forEach(note => {
        const card = document.createElement("div");
        card.className = "note-card";
        card.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${note.title}</h3>
            <p class="mb-3">${note.text}</p>
            <span class="text-sm italic text-gray-300">📂 ${note.category}</span>
            <div class="flex justify-end mt-3 space-x-3">
                <button class="px-2 py-1 rounded bg-yellow-500 text-black edit-btn">✏️</button>
                <button class="px-2 py-1 rounded bg-red-500 delete-btn">🗑️</button>
            </div>
        `;

        // Delete
        card.querySelector(".delete-btn").onclick = () => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes();
            renderNotes();
        };

        // Edit
        card.querySelector(".edit-btn").onclick = () => {
            document.getElementById("noteId").value = note.id;
            document.getElementById("noteName").value = note.title;
            document.getElementById("noteText").value = note.text;
            document.getElementById("noteCategory").value = note.category;
            document.getElementById("modalTitle").innerText = "Edit Note";
            openModal();
        };

        notesContainer.appendChild(card);
    });
}

// Modal Controls
function openModal() { noteModal.classList.add("active"); }
function closeModal() {
    noteModal.classList.remove("active");
    noteForm.reset();
    document.getElementById("noteId").value = "";
    document.getElementById("modalTitle").innerText = "Add Note";
}

// Events
addBtn.onclick = openModal;
cancelBtn.onclick = closeModal;

noteForm.onsubmit = (e) => {
    e.preventDefault();

    const id = document.getElementById("noteId").value;
    const title = document.getElementById("noteName").value;
    const text = document.getElementById("noteText").value;
    const category = document.getElementById("noteCategory").value;

    if (id) {
        notes = notes.map(n => n.id === id ? { ...n, title, text, category } : n);
    } else {
        notes.push({ id: Date.now().toString(), title, text, category, dateCreated: new Date().toISOString() });
    }

    saveNotes();
    renderNotes();
    closeModal();
};

// Search
searchInput.oninput = (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = notes.filter(
        n =>
            n.title.toLowerCase().includes(q) ||
            n.text.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q)
    );
    renderNotes(filtered);
};

// Sort
sortBtn.onclick = () => {
    currentSortOrder = currentSortOrder === "newest" ? "oldest" : "newest";
    renderNotes();
    alert(`Sorting notes by ${currentSortOrder}`);
};

// Init
renderNotes();