const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
   host: '127.0.0.1',
   user: 'appuser',
   password: 'apppassword',
   database: 'attendance_db'
});
// Add student
app.post('/api/students', (req, res) => {
   const { name } = req.body;
   db.query('INSERT INTO students (name) VALUES (?)', [name], (err, result) => {
       if (err) return res.status(500).json({ error: 'Database error' });
       res.json({ id: result.insertId, name });
   });
});
// Get students
app.get('/api/students', (req, res) => {
   db.query('SELECT * FROM students', (err, results) => {
       if (err) return res.status(500).json({ error: 'Database error' });
       res.json(results);
   });
});
// Mark attendance
app.post('/api/attendance', (req, res) => {
   const { student_id, date, status } = req.body;
   db.query('INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)', [student_id, date, status], (err) => {
       if (err) return res.status(500).json({ error: 'Database error' });
       res.json({ success: true });
   });
});
// Get attendance
app.get('/api/attendance', (req, res) => {
   db.query('SELECT a.id, a.student_id, s.name, a.date, a.status FROM attendance a JOIN students s ON a.student_id = s.id', (err, results) => {
       if (err) return res.status(500).json({ error: 'Database error' });
       res.json(results);
   });
});
app.listen(3000, () => console.log('Server running on port 3000'));