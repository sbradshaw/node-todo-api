// server.js

require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

let app = express();
app.use(bodyParser.json());

// POST /todos
app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save()
    .then((doc) => {
      res.status(200);
      res.send(doc);
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id})
    .then((todos) => {
      res.send({
        todos
      });
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

// GET /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({_id: id, _creator: req.user._id})
    .then((todo) => {
    
      if (!todo) {
        return res.status(404).send();
      }
      
      res.send({
        todo
      });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

// DELETE /todos
app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findOneAndRemove({_id: id, _creator: req.user._id})
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

// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  
  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
    .then((todo) => {
      
      if (!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    })
    .catch((err) => {
      res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.status(200);
      res.header('x-auth', token);
      res.send(user);
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token);
          res.send(user);
        });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
};
