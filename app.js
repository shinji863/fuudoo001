const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs') //追加
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(__dirname + "/public"));

const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'database-1.cjehdi86p6io.ap-northeast-1.rds.amazonaws.com',
  user: 'admin',
	password: 'fuudooadmin',
	port: 3306,
	database: 'fuudoo_db'
});

con.connect(function(err) {
	if (err) throw err;
	console.log('Connected');
});

app.get('/', (req, res) => {
	const sql = "select * from properties";
	con.query(sql, function (err, result, fields) {
	if (err) throw err;
	res.render('index',{properties : result});
	});
});

app.get('/create', (req, res) =>
	res.sendFile(path.join(__dirname, 'html/form.html')))

app.get('/delete/:id',(req,res)=>{
	const sql = "DELETE FROM properties WHERE id = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		console.log(result)
		res.redirect('/');
	})
});

app.get('/edit/:id',(req,res)=>{
	const sql = "SELECT * FROM properties WHERE id = ?";
	con.query(sql,[req.params.id],function (err, result, fields) {
		if (err) throw err;
		res.render('edit',{property : result});
		});
});

app.set('view engine', 'ejs');

app.post('/', (req, res) => {
	const sql = "INSERT INTO properties SET ?"

	con.query(sql,req.body,function(err, result, fields){
		if (err) throw err;
		console.log(result);
		res.redirect('/');

	});
});

app.post('/update/:id',(req,res)=>{
	const sql = "UPDATE properties SET ? WHERE id = " + req.params.id;
	con.query(sql,req.body,function (err, result, fields) {
		if (err) throw err;
		console.log(result);
		res.redirect('/');
		});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

