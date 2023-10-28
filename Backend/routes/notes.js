const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const { getByTitle } = require('@testing-library/react');

// Route 1:- get all the notes using : GET "/api/notes/getuser". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Occured");

    }
});

// Route 2:- add a new note using : POST"/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 4 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),

], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        //if there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id

        })
        const saveNote = await note.save()

        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Occured");

    }
});

// Route 3:- update an existing note using : PUT"/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a newnote object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find a node to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { req.status(404).send("Not found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Occured");

    }

})

// Route 4:- delete an existing note using : DELETE"/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find a node to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { res.status(404).send("Not found") };

        // Allowing deletion only if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "The note has being deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Occured");

    }

})

module.exports = router;