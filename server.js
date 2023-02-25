const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;



app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required.' });
  }

  const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kishansomaiya2712@gmail.com',
      pass: 'Kishan2712!'
    }
  });

  const mailOptions = {
    from: 'Kishan Somaiya <',
    to: email,
    subject: 'OTP Verification for Todo App',
    text: `Your OTP is ${otp}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'Error sending OTP.' });
    }

    console.log(`OTP sent to ${email}: ${otp}`);

    return res.status(200).send({ message: 'OTP sent.' });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send({ message: 'Email and OTP are required.' });
  }

  // You can store the OTP in a database or in-memory data structure
  // For simplicity, we'll store it in a variable
  let storedOtp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

  if (otp === storedOtp) {
    // OTP is valid, send success response
    return res.status(200).send({ message: 'OTP verified.' });
  } else {
    // OTP is invalid, send error response
    return res.status(400).send({ message: 'Invalid OTP.' });
  }
});

let todos = [
  { id: 1, title: 'Todo 1', completed: false },
  { id: 2, title: 'Todo 2', completed: false },
  { id: 3, title: 'Todo 3', completed: false }
];
let idCounter = 4;

app.get('/todos', (req, res) => {
  return res.status(200).send(todos);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).send({ message: 'Title is required.' });
  }

  const newTodo = { id: idCounter++, title, completed: false };
  todos.push(newTodo);

  return res.status(201).send(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const index = todos.findIndex(todo => todo.id === parseInt(id));

  if (index === -1) {
    return res.status(404).send({ message: 'Todo not found.' });
  }

  if (title) {
    todos[index].title = title;
  }

  if (completed !== undefined) {
    todos[index].completed = completed;
  }

  return res.status(200).send(todos[index]);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const index = todos.findIndex(todo => todo.id === parseInt(id));

  if (index === -1) {
    return res.status(404).send({ message: 'Todo not found.' });
  }

  todos.splice(index, 1);

  return res.status(204).send();
});

app.delete('/todos', (req, res) => {
  todos = [];

  return res.status(204).send();
});

app.get('/', (req,res) => {
    return res.status(200).send('Hel World!');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });