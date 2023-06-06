
// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

//Sets up the Express App

const app = express();
var PORT = process.env.PORT || 3001;


// Sets up the Express app to handle data parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Grabbing html files

app.use(express.static('public'));

// Routes for HTML

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        console.log(data);
        res.json(JSON.parse(data))
    })

})


// Create New Notes 

app.post("/api/notes", (req, res) => {

    let note = req.body;
    note["id"] = Date.now();
    note["title"] = req.body.title;
    note["text"] = req.body.text;

    fs.readFile('./db/db.json', 'utf8', (error, file) => {
        if (error) throw error;

        const parsedFile = JSON.parse(file);
        parsedFile.push(note);


        const newStringifiedFile = JSON.stringify(parsedFile);


        fs.writeFile('./db/db.json', newStringifiedFile, 'utf8', (err) => {
            if (err) throw err;
            console.log("The new note was appended to the file!");
        });


        return res.send(JSON.parse(newStringifiedFile));
    });
});

// Deletes selected note 

app.delete("/api/notes/:id", (req, res) => {
    //filter method by ID, create a new array without that ID
    fs.readFile('./db/db.json', 'utf8', (error, file) => {
        if (error) throw error;


        let deletedNoteId = req.params.id;



        const parsedFile = JSON.parse(file);


        const newParsedFile = parsedFile.filter(elem => elem.id != deletedNoteId);


        const newStringifiedFile = JSON.stringify(newParsedFile);



        fs.writeFile('./db/db.json', newStringifiedFile, 'utf8', (err) => {
            if (err) throw err;
            console.log("The note was deleted!");
        });




        return res.send(JSON.parse(newStringifiedFile));
    });
});

// Basic route that sends the user first to the AJAX Page

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)



// Starts the server to begin listening

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);