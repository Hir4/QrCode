const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var path = require('path');
var home = path.join(__dirname, '/pages/home/');
var signin = path.join(__dirname, '/pages/signin/');
var store = path.join(__dirname, '/pages/store/');

///////////////////////////////////////
//////////////HOME PAGE///////////////
/////////////////////////////////////

app.get('/', function (req, res) {
  res.cookie('newIdToken', { expires: Date.now() });
  res.sendFile(path.join(home, 'index.html'));
});

app.get('/pages/home/style.css', function (req, res) {
  res.sendFile(path.join(home, 'style.css'));
});

app.get('/pages/home/script.js', function (req, res) {
  res.sendFile(path.join(home, 'script.js'));
});

///////////////////////////////////////
///////////SIGN IN PAGE///////////////
/////////////////////////////////////

app.get('/signin', function (req, res) {
  res.cookie('newIdToken', { expires: Date.now() });
  res.sendFile(path.join(signin, 'index.html'));
});

app.get('/pages/signin/style.css', function (req, res) {
  res.sendFile(path.join(signin, 'style.css'));
});

app.get('/pages/signin/script.js', function (req, res) {
  res.sendFile(path.join(signin, 'script.js'));
});

///////////////////////////////////////
///////////STORE PAGE/////////////////
/////////////////////////////////////

app.get('/store', function (req, res) {
  res.sendFile(path.join(store, 'index.html'));
});

app.get('/pages/store/style.css', function (req, res) {
  res.sendFile(path.join(store, 'style.css'));
});

app.get('/pages/store/script.js', function (req, res) {
  res.sendFile(path.join(store, 'script.js'));
});

app.get('/qrcode.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'qrcode.js'));
});

///////////////////////////////////////
///////////LOGIN DATA/////////////////
/////////////////////////////////////

app.post('/login', (req, res) => {
  try {
    const user = req.body.user;
    const newIdTokenGenerate = `7573756172696f${(new Date()).getTime()}`;
    const hashIdToken = crypto.createHash('sha256').update(newIdTokenGenerate).digest('base64');
    const newHashIdToken = `${hashIdToken}:${user}`;
    const password = req.body.password;
    res.cookie(`newIdToken`, newHashIdToken, { maxAge: 900000, httpOnly: true });

    fs.readFile('./users.json', function (err, data) {
      const dataUser = JSON.parse(data);
      const foundName = dataUser.users.find(username => username.username === user);
      if(foundName !== undefined) {
        bcrypt.compare(password, foundName.password, function (err, result) {
          if (result === true) {
            if (foundName.username === user && newIdTokenGenerate) {
              console.log("entrou");
              res.send("/store");
            } else {
              res.send("/");
              console.log("Usuário ou senha inválida");
            }
          }
        });
      }else{res.send("/");}
    })

  } catch (err) {
    console.error('Error');
    console.log("error in post /login");
  }
});

///////////////////////////////////////
///////////SIGNIN DATA////////////////
/////////////////////////////////////

app.post('/signinuser', (req, res) => {
  try {
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    const confirmepassword = req.body.confirmepassword;

    if (password === confirmepassword) {

      bcrypt.hash(password, saltRounds, function (err, hash) {
        console.log(hash);
        let newUser = {
          'username': user,
          'email': email,
          'password': hash
        };

        fs.readFile('./users.json', function (err, data) {
          const dataUser = JSON.parse(data);
          const foundName = dataUser.users.find(username => username.username === newUser.username);
          const foundEmail = dataUser.users.find(email => email.email === newUser.email);

          if (foundName === undefined && foundEmail === undefined) {
            dataUser.users.push(newUser);

            fs.writeFile("./users.json", JSON.stringify(dataUser), function () {
              console.log('Done!');
            })

            res.send("/");
          } else {
            console.log("Já existe o login");
            res.send("");
          }
        });
      });

    } else { console.log("Senhas diferentes"); }

  } catch (err) {
    console.error('Error');
    console.log("error in post /signinuser");
  }
});

///////////////////////////////////////
///////////TICKET DATA////////////////
/////////////////////////////////////

app.post('/ticket', function (req, res) {
  try {
    const ticketContent = req.body.ticketContent;
    const newIdToken = req.cookies[`newIdToken`];
    const ownerTicketName = newIdToken.split(":")[1];
    console.log(newIdToken);

    if (!newIdToken) {
      res.send("/");
      return true;
    }

    fs.readFile('./users.json', function (err, data) {
      const dataTicket = JSON.parse(data);

      const ticketContainer = {
        owner: ownerTicketName,
        content: ticketContent,
        token: newIdToken
      };

      dataTicket.tickets.push(ticketContainer);
      console.log(dataTicket.tickets);

      fs.writeFile("./users.json", JSON.stringify(dataTicket), function () {
        console.log('Done!');
      });

      res.send(dataTicket.tickets);

    })

  } catch (err) {
    console.error('Error');
    console.log("error in post /ticket");
    res.send("/");
  }

})

app.get('/ticket', function (req, res) {
  try {
    const newIdToken = req.cookies[`newIdToken`];
    const compareOwnerName = newIdToken.split(":")[1];
    const keepAllOwnerTicket = [];

    fs.readFile('./users.json', function (err, data) {
      const dataTicket = JSON.parse(data);

      const foundOwnerTicket = dataTicket.tickets;

      foundOwnerTicket.map(everyTicket => {
        if (everyTicket.owner === compareOwnerName) {
          keepAllOwnerTicket.push(everyTicket);
        }
      })

      res.send(keepAllOwnerTicket);
    })
  } catch (err) {
    console.error('Error');
    console.log("error in get /ticket");
    res.send("/");
  }

});

app.listen(80);