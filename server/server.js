const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({
        todos
      });
    }, (err) => {
      res.status(400);
      res.send(err);
    });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      
      if (!todo) {
        return res.status(404).send();
      } 
      
      res.status(200);
      res.send({
        todo
      });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((doc) => {
      res.status(200);
      res.send(doc);
    }, (err) => {
      res.status(400);
      res.send(err);
    });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app: app
}
