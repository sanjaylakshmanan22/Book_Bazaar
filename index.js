import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Books",
    password: "post1234",
    port: 1234,
  });
db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


async function title() {
    const result = await db.query("SELECT title FROM books");
    let title = [];
    result.rows.forEach((book) => {
      title.push(book.title);
    });
    return title;
}
async function isbn() {
    const result = await db.query("SELECT isbn FROM books");
    let id = [];
    result.rows.forEach((book) => {
      id.push(`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`);
    });
    return id;
}
async function dateRead() {
    const result = await db.query("SELECT TO_CHAR(date_read, 'YYYY-MM-DD') AS date,rating FROM books;");
    let date = [];
    result.rows.forEach((book) => {
      date.push(`Date read: ${book.date}. How strongly I recommend it: ${book.rating}/10`);
    });
    return date;
}
async function reviews() {
    const result = await db.query("SELECT review FROM books");
    let review = [];
    result.rows.forEach((book) => {
      review.push(book.review);
    });
    return review;
}


app.get("/",async (req,res)=>{
    const date_read = await dateRead();
    const book = await title();
    const id = await isbn();
    const review = await reviews();
    res.render("index.ejs",{id,titles:book,date:date_read,review});
});

app.listen(port,() =>{
    console.log(`Server running on http://localhost:${port}`);
});