const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config({path: './config.env'});

const app = express(); 
const DB = process.env.DATABASE
const Todo = require('./models/Todo')

app.use(express.json());
app.use(cors());

mongoose.connect(DB, {
	useNewUrlParser: true, 
	useCreateIndex:true,
	useFindAndModify:false, 
	useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

const middleware = (req,res,next)=> {
	console.log("hello midleware")
	next();
} 

// Models
app.get( '/', (req,res)=> {
	res.send('hellooo worldddd')
})
 
app.get('/todos', async (req, res) => {
	const todos = await Todo.find();

	res.json(todos);
});

app.post('/todo/new', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	})

	todo.save();

	res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});

app.listen(3001);