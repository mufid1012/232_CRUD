const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', 
  database: 'Biodata',
  port: 3307    
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connctions Succesfully!');
});

app.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM biodata', (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err.stack);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

app.post('/mahasiswa', (req, res) => {
    const { nama, nim, kelas, prodi } = req.body;

    if (!nama || !nim || !kelas || !prodi) {
        return res.status(400).json('All fields are required');
    }

    db.query(
        'INSERT INTO biodata (nama, nim, kelas, prodi) VALUES (?, ?, ?, ?)', 
        [nama, nim, kelas, prodi], 
        (err, results) => {
            if (err) {
            console.error(err);
            return res.status(500).json('Database Error');}
            

                res.status(201).json({ message: 'User created successfully'});

            });
});

app.put('/mahasiswa/:id', (req, res) => {
    const userid =req.params.id;
    const { nama, nim, kelas, prodi } = req.body;

    db.query(
        'UPDATE biodata SET nama = ?, nim = ?, kelas = ?, prodi = ? WHERE id = ?',
        [nama, nim, kelas, prodi, userid],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Database Error');
            }
            res.json({ message: 'User updated successfully' });
        }
    );
});