document.addEventListener('DOMContentLoaded', () => {
      const addStudentForm = document.getElementById('addStudentForm');
      const markAttendanceForm = document.getElementById('markAttendanceForm');
      const studentSelect = document.getElementById('studentSelect');
      const attendanceTableBody = document.querySelector('#attendanceTable tbody');

      // Load students
      function loadStudents() {
          fetch('/api/students')
              .then(res => res.json())
              .then(students => {
                  studentSelect.innerHTML = '<option value="">Select Student</option>';
                  students.forEach(student => {
                      const option = document.createElement('option');
                      option.value = student.id;
                      option.textContent = student.name;
                      studentSelect.appendChild(option);
                  });
              })
              .catch(err => console.error('Error loading students:', err));
      }

      // Load attendance
      function loadAttendance() {
          fetch('/api/attendance')
              .then(res => res.json())
              .then(records => {
                  attendanceTableBody.innerHTML = '';
                  records.forEach(record => {
                      const row = document.createElement('tr');
                      row.innerHTML = `
                          <td>${record.id}</td>
                          <td>${record.name}</td>
                          <td>${record.date}</td>
                          <td>${record.status}</td>
                      `;
                      attendanceTableBody.appendChild(row);
                  });
              })
              .catch(err => console.error('Error loading attendance:', err));
      }

      // Add student
      addStudentForm.addEventListener('submit', e => {
          e.preventDefault();
          const name = document.getElementById('studentName').value;
          fetch('/api/students', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name })
          })
              .then(res => res.json())
              .then(() => {
                  document.getElementById('studentName').value = '';
                  loadStudents();
              })
              .catch(err => console.error('Error adding student:', err));
      });

      // Mark attendance
      markAttendanceForm.addEventListener('submit', e => {
          e.preventDefault();
          const student_id = document.getElementById('studentSelect').value;
          const date = document.getElementById('attendanceDate').value;
          const status = document.getElementById('attendanceStatus').value;
          fetch('/api/attendance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ student_id, date, status })
          })
              .then(res => res.json())
              .then(() => {
                  document.getElementById('markAttendanceForm').reset();
                  loadAttendance();
              })
              .catch(err => console.error('Error marking attendance:', err));
      });

      // Initial load
      loadStudents();
      loadAttendance();
  });