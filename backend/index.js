require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

const User = require('./models/user.model')
const Note = require('./models/note.model')

mongoose.connect(config.connectionString)

const express = require('express')
const cors = require('cors');
const app = express()

const jwt = require('jsonwebtoken')

const authenticateToken = require("./utilities")

app.use(express.json())
app.use(
    cors({
        origin: '*',
    })
);

app.get('/', (req, res) => {
    res.json({ data: 'hello' })
})

//create account
app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: 'Please enter your full name.' });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: 'Please enter your email address.' });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Please enter your password.' });
    }
    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.status(400).json({ error: true, message: 'User already exists.' });
    }
    const user = new User({ fullName, email, password });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '36000m' });
    return res.json({
        error: false,
        message: 'User registered successfully.',
        accessToken,
        user,
    })
})

//login 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: true, message: 'Please enter your email address.' });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Please enter your password.' });
    }
    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
        return res.status(400).json({ error: true, message: 'User not found.' });
    }
    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo }
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '36000m' });
        return res.json({
            error: false,
            message: 'User logged in successfully.',
            accessToken,
            email
        })
    }
    else {
        return res.status(400).json({ error: true, message: 'Invalid credentials.' });
    }
})

//get user
app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
        return res.sendStatus(401);
    }
    return res.json({
        error: false,
        message: '',
        user: {
            fullName: isUser.fullname,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdAt,
        },
    })
})

//add note
app.post('/add-note', async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const { user } = req.user;

        if (!title) {
            return res.status(400).json({ error: true, message: 'Please enter a title.' });
        }
        if (title.trim() === '') {
            return res.status(400).json({ error: true, message: 'Title cannot be empty.' });
        }
        if (!content) {
            return res.status(400).json({ error: true, message: 'Please enter content.' });
        }
        if (content.trim() === '') {
            return res.status(400).json({ error: true, message: 'Content cannot be empty.' });
        }

        const note = new Note({ title, content, tags: tags || [], user: user._id });
        await note.save();
        return res.json({
            error: false,
            message: 'Note added successfully.',
            note
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

//edit note
app.put('/edit-note/:notId', authenticateToken, async (req, res) => {
    const noteId = req.params.notId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: 'No changes provided' });
    }
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }
        if (title) {
            note.title = title;
        }
        if (content) {
            note.content = content;
        }
        if (tags) {
            note.tags = tags;
        }
        if (isPinned) {
            note.isPinned = isPinned;
        }
        await note.save();
        return res.json({ error: false, message: 'Note updated successfully', note })
    }
    catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' })
    }

})

//get all notes
app.get('/get-all-notes/', authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            message: 'Notes fetched successfully.',
            notes
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

// delete a note
app.delete('/delete-note/:notId', authenticateToken, async (req, res) => {
    const noteId = req.params.notId;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }
        await Note.deleteOne({ _id: noteId, userId: user._id })
        return res.json({
            error: false,
            message: 'Note deleted successfully.',
            note
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

//Update isPinned value
app.put('/update-note-pinned/:notId', authenticateToken, async (req, res) => {
    const noteId = req.params.notId;
    const { isPinned } = req.body;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }
        if (isPinned) {
            note.isPinned = isPinned || false;
        }
        await note.save();
        return res.json({
            error: false,
            message: 'Pinned status updated successfully.',
            note
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

app.listen(8000);
module.exports = app;
