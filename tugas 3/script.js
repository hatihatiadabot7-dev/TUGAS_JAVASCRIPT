let students = [];

const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentScoreInput = document.getElementById('studentScore');
const studentList = document.getElementById('studentList');
const totalStudentsEl = document.getElementById('totalStudents');
const averageScoreEl = document.getElementById('averageScore');
const alertContainer = document.getElementById('alertContainer');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');

document.addEventListener('DOMContentLoaded', () => {
  loadStudentsFromLocalStorage();
  render();
});

function loadStudentsFromLocalStorage() {
  const storedData = localStorage.getItem('students');
  if (storedData) {
    students = JSON.parse(storedData);
  } else {
    students = [];
  }
}

function saveStudentsToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

function render() {
  renderStudentList();
  renderStats();
}

function renderStudentList() {
  studentList.innerHTML = '';

  if (students.length === 0) {
    studentList.innerHTML = `<div class="empty-state">Belum ada data siswa. Silakan tambahkan!</div>`;
    return;
  }

  students.forEach((student, index) => {
    const card = document.createElement('div');
    card.className = 'student-card';

    card.innerHTML = `
      <div class="student-info">
        <h4>${index + 1}. ${student.name}</h4>
        <p>Nilai: <strong>${student.score}</strong></p>
      </div>
      <div class="student-actions">
        <button class="btn btn-warning" onclick="handleEdit(${student.id})">✏️ Ubah</button>
        <button class="btn btn-danger" onclick="handleDelete(${student.id})">🗑️ Hapus</button>
      </div>
    `;

    studentList.appendChild(card);
  });
}

function renderStats() {
  const total = students.length;
  totalStudentsEl.textContent = total;

  if (total === 0) {
    averageScoreEl.textContent = '0';
    return;
  }

  const sumScore = students.reduce((acc, curr) => acc + Number(curr.score), 0);
  const avg = (sumScore / total).toFixed(1);
  averageScoreEl.textContent = avg;
}

studentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = studentIdInput.value;
  const name = studentNameInput.value.trim();
  const score = parseInt(studentScoreInput.value, 10);

  if (!name || isNaN(score)) return;

  if (id) {
    updateStudent(Number(id), name, score);
  } else {
    addStudent(name, score);
  }

  saveStudentsToLocalStorage();
  render();
  resetForm();
});

function addStudent(name, score) {
  const newStudent = {
    id: Date.now(),
    name: name,
    score: score
  };

  students.push(newStudent);
  showAlert(`✅ Data siswa ${name} berhasil ditambahkan.`);
}

function handleEdit(id) {
  const student = students.find((s) => s.id === id);
  if (!student) return;

  studentIdInput.value = student.id;
  studentNameInput.value = student.name;
  studentScoreInput.value = student.score;

  formTitle.textContent = '✏️ Edit Data Siswa';
  btnSubmit.textContent = '💾 Update Siswa';
  btnCancel.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStudent(id, name, score) {
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex !== -1) {
    students[studentIndex].name = name;
    students[studentIndex].score = score;
    showAlert(`🔄 Data siswa ${name} berhasil diperbarui.`);
  }
}

function handleDelete(id) {
  const student = students.find((s) => s.id === id);
  if (!student) return;

  const isConfirmed = confirm(`Apakah kamu yakin ingin menghapus siswa ${student.name}?`);

  if (isConfirmed) {
    students = students.filter((s) => s.id !== id);
    saveStudentsToLocalStorage();
    render();

    if (studentIdInput.value == id) {
      resetForm();
    }

    showAlert(`🗑️ Data siswa ${student.name} berhasil dihapus.`);
  }
}

btnCancel.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  studentForm.reset();
  studentIdInput.value = '';
  formTitle.textContent = '➕ Tambah Siswa Baru';
  btnSubmit.textContent = '➕ Tambah Siswa';
  btnCancel.classList.add('hidden');
}

function showAlert(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-success">
      ${message}
    </div>
  `;

  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 3000);
}