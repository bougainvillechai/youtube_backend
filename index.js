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
app.post('/create', (req, res) => {
 fs.writeFile('./files/'+(req.body.title).split(' ').join('')+'.txt', req.body.details, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    } else {
      res.redirect('/');
    }
  });
});
app.get('/delete/:filename',(req, res)=>{
  console.log(req.params);
  fs.unlink('./files/'+req.params.filename, (err)=>{
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