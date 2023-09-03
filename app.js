
/*const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && user.password === password) {
    res.redirect('/dashboard'); 
  } else {
    res.redirect('/login'); 
  }
});



app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Create a new user and save to the database
  const newUser = new User({ username, password });
  await newUser.save();

  res.redirect('/login'); // Redirect to login page after successful registration
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the provided username and password match a user in the database
  const user = await User.findOne({ username, password });

  if (user) {
    res.redirect('/dashboard'); // Redirect to dashboard on successful login
  } else {
    res.redirect('/login'); // Redirect back to login page on invalid login
  }
});


app.get('/dashboard', (req, res) => {
  // You can add more authentication checks here if needed
  // For example, if (!req.session.userId) { ... }

  res.render('dashboard');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
require('dotenv').config();
const PORT = 3000;

const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);




app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('play', () => {
      io.emit('play');
  });

  socket.on('pause', () => {
      io.emit('pause');
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// ... Define the user schema and model ...
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  points: {
    type: Number,
    default: 10000, // Default points for new users
  },
});

const User = mongoose.model('User', userSchema);
// Configure sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized: false
  })
);
app.use(bodyParser.json());

// Routes


// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    //const hashedPassword = await bcrypt.hash(password, 10); // Generate a salted hash
    const newUser = new User({ username, password});
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    res.redirect('/signup');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (password === user.password)) {
      req.session.user = user; // Store user in session
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.redirect('/login');
  }
});

app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated (stored in the session)
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin', (req, res) => {
  res.render('admin'); // Render the 'admin.ejs' template
});

app.post('/updatePoints', async (req, res) => {
  try {
    // Check if the user is authenticated (stored in the session)
    
    const { totalPoints } = req.body;
    const user = req.session.user;

    // Retrieve the user's current points from the database
    const currentUser = await User.findOne({ _id: user._id });

    if (!currentUser) {
      return res.status(404).send('User not found');
    }

    // Calculate the new points based on the user's bet result
    let newPoints = totalPoints;

    // Update the user's points in the database
    await User.findByIdAndUpdate(user._id, { $set: { points: newPoints } });

    return res.status(200).send('Points updated successfully');
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).send('Internal server error');
  }
});



app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
