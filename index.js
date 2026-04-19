const express = require('express');
const fs = require('fs');
const app = express();
app.set('view engine', 'ejs');
const path = require('path');
const ejs = require('ejs');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir('./files',(err, files)=>{
    res.render('index', {files:files});
  })
});

app.get('/read/:filename', (req, res) => {
  const filenames = './files/'+req.params.filename;
  fs.readFile(filenames,'utf-8', (err, content) => {
    if(err){
      console.error(err);
      res.status(500).send('Error reading file');
    }
    else {
      console.log("Filename:    ", req.params.filename);
      const lines = content.split('\n');
      const title = lines[0];
      const contents = content.split('\n').slice(1).join('\n');
      res.render('read', {content: contents, files: filenames, title: title});
    }
  });
});

app.post('/create', (req, res) => {
  const title = req.body.title;
  const details = title + '\n' + req.body.details;
 fs.writeFile('./files/'+(req.body.title).split(' ').join('')+'.txt', details, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:filename',(req, res)=>{
  const fileName  = './files/'+req.params.filename.split(' ').join('')+'.txt';
  fs.unlink(fileName, (err)=>{
    if(err){
      console.error(err);
      res.status(500).send('Error deleting file');
    } else {
      res.redirect('/');
    }
  });
})

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});