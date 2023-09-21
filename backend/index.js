import express from 'express';
import mysql from 'mysql2';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Zxcvbnm123-',
  database: 'test',
  port: '3306'
});

// Allow sent JSON to the database
app.use(express.json());

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');

  app.get("/",(req,res)=>{
    res.json("hello from backend")
  })

  app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  });

  app.post("/books", (req, res) => {
    const q = "INSERT INTO books(`title`, `desc`, `cover`,`price`) VALUES (?)";
  
    const values = [
        req.body.title,
        req.body.desc,
        req.body.cover,
        req.body.price,
  
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json('book has been created');
      });
    });
  
    app.delete("/books/:id", (req, res) => {
        const bookId = req.params.id;
        const q = " DELETE FROM books WHERE id = ? ";
      
        db.query(q, [bookId], (err, data) => {
          if (err) return res.send(err);
          return res.json(data);
        });
      });
      
    app.put("/books/:id", (req, res) => {
      const bookId = req.params.id;
      const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

      const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
      ];

      db.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
    });

  // Start the Express server
  app.listen(8800, () => {
    console.log('Server is running on port 8800');
  });
});


