const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('pages'));

let path = require('path');
const { totalmem } = require('os');
let home = path.join(__dirname, '/pages/home/');
let login = path.join(__dirname, '/pages/login/');
let signin = path.join(__dirname, '/pages/signin/');
let store = path.join(__dirname, '/pages/store/');
let admin = path.join(__dirname, '/pages/admin/');
let client = path.join(__dirname, '/pages/client/');
let confirm = path.join(__dirname, '/pages/confirm/');
let publicLogo = path.join(__dirname, '/public/logo/');
let publicImg = path.join(__dirname, '/public/img/');
let invalid = path.join(__dirname, '/pages/invalid/');
let valid = path.join(__dirname, '/pages/valid/');

let tokenCheck;
const saltRounds = 10;
let newIdTokenGenerate;
let userId;
let allEventsBought = {};
let user;
let event;

///////////////////////////////////////
//////////////IMAGES//////////////////
/////////////////////////////////////

app.get('/public/logo/login.svg', (req, res) => {
  res.sendFile(path.join(publicLogo, 'login.svg'))
});

app.get('/public/logo/signin.svg', (req, res) => {
  res.sendFile(path.join(publicLogo, 'signin.svg'))
});

app.get('/public/img/fest.svg', (req, res) => {
  res.sendFile(path.join(publicImg, 'fest.svg'))
});

app.get('/public/img/fest2.png', (req, res) => {
  res.sendFile(path.join(publicImg, 'fest2.png'))
});

app.get('/public/img/fest3.jpg', (req, res) => {
  res.sendFile(path.join(publicImg, 'fest3.jpg'))
});

app.get('/public/img/fest4.png', (req, res) => {
  res.sendFile(path.join(publicImg, 'fest4.png'))
});

///////////////////////////////////////
/////////////Login PAGE///////////////
/////////////////////////////////////

app.get('/', (req, res) => {
  res.clearCookie("newIdToken");
  allEventsBought = {};
  res.sendFile(path.join(home, 'index.html'))
});

///////////////////////////////////////
/////////////Login PAGE///////////////
/////////////////////////////////////

app.get('/loginpage', (req, res) => {
  res.clearCookie("newIdToken");
  allEventsBought = {};
  res.sendFile(path.join(login, 'index.html'));
});

///////////////////////////////////////
///////////SIGN IN PAGE///////////////
/////////////////////////////////////

app.get('/signin', (req, res) => {
  res.clearCookie("newIdToken");
  res.sendFile(path.join(signin, 'signin.html'));
});

///////////////////////////////////////
/////////////ADMIN PAGE///////////////
/////////////////////////////////////

app.get('/admin', (req, res) => {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    res.sendFile(path.join(admin, 'admin.html'));
  } else { res.redirect("/loginpage"); }
});

///////////////////////////////////////
////////////CLIENT PAGE///////////////
/////////////////////////////////////

app.get('/client', (req, res) => {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    res.sendFile(path.join(client, 'client.html'));
  } else { res.redirect("/loginpage"); }
});

///////////////////////////////////////
///////////STORE PAGE/////////////////
/////////////////////////////////////

app.get('/store', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    res.sendFile(path.join(store, 'store.html'));
  } else { res.redirect("/loginpage"); }
});

///////////////////////////////////////
/////////////VALID PAGE///////////////
/////////////////////////////////////

app.get('/valid', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    res.sendFile(path.join(valid, 'valid.html'));
  } else { res.redirect("/loginpage"); }
});

app.post('/valid', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck && newIdToken.split(":")[2] === "admin") {
    try {
      fs.readFile('./events.json', function (err, data) {
        const dataTicket = JSON.parse(data);
        dataTicket[event].userJoin[user].activeQRCode = false;
        fs.writeFile("./events.json", JSON.stringify(dataTicket), function () { })
        let arrived = 0;
        let expected = 0;
        for (let key in dataTicket[event].userJoin) {
          if (dataTicket[event].userJoin[key].activeQRCode === true) {
            expected++
          } else { arrived++ }
        }
        let total = expected + arrived;
        const eventData = {
          eventName: dataTicket[event].eventName,
          guestsTotal: total,
          guestsArrived: arrived,
          guestsExpected: expected,
        }
        res.send(eventData);
      });

    } catch (err) {
      res.send("/loginpage");
    }

  } else {
    res.send("/loginpage");
  }
});

///////////////////////////////////////
///////////INVALID PAGE///////////////
/////////////////////////////////////

app.get('/invalid', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    res.sendFile(path.join(invalid, 'invalid.html'));
  } else { res.redirect("/loginpage"); }
});

///////////////////////////////////////
//////////CONFIRM PAGE////////////////
/////////////////////////////////////

app.get('/confirm', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck && newIdToken.split(":")[2] === "admin") {
    let getUserIdFromToken = req.query.user;
    user = getUserIdFromToken.split(":")[1];
    event = req.query.event;
    res.sendFile(path.join(confirm, 'confirm.html'));
  } else { res.redirect('/loginpage') }
});

app.post('/confirm', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck && newIdToken.split(":")[2] === "admin") {

    try {
      fs.readFile('./events.json', function (err, data) {
        const dataTicket = JSON.parse(data);
        if (dataTicket[event].userJoin[user].activeQRCode === true) {
          const eventData = {
            eventName: dataTicket[event].eventName,
            eventDate: dataTicket[event].eventDate,
            eventPlace: dataTicket[event].eventPlace,
            clientName: dataTicket[event].userJoin[user].name,
            clientId: dataTicket[event].userJoin[user].docId,
            active: dataTicket[event].userJoin[user].activeQRCode,
          }
          res.send(eventData);
        } else {
          res.send("/invalid");
        }
      });

    } catch (err) {
      res.send("/");
    }

  } else {
    res.send("/");
  }
});

///////////////////////////////////////
///////////QR CODE ///////////////////
/////////////////////////////////////

app.get('/qrcode.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'qrcode.js'));
});

///////////////////////////////////////
///////////LOGIN DATA/////////////////
/////////////////////////////////////

app.post('/login', (req, res) => {
  try {
    const login = req.body.user;
    const password = req.body.password;
    let user;

    fs.readFile('./users.json', function (err, data) {
      const dataUser = JSON.parse(data);

      for (let key in dataUser) {
        if (login === dataUser[key].userName) {
          user = key
        }
      }

      if (typeof user == "undefined") {
        res.send("/loginpage");
        return true;
      }

      const foundName = dataUser[user].userName;

      if (typeof foundName !== undefined) {
        bcrypt.compare(password, dataUser[user].password, function (err, result) {
          if (result === true) {
            newIdTokenGenerate = `7573756172696f${(new Date()).getTime()}:${foundName}`;
            const hashIdToken = crypto.createHash('sha256').update(newIdTokenGenerate).digest('base64');
            if (dataUser[user].class === "admin") {
              newHashIdToken = `${hashIdToken}:${hashIdToken}:${dataUser[user].class}`;
              tokenCheck = newHashIdToken;
              res.cookie(`newIdToken`, newHashIdToken, { httpOnly: true });
              res.send("/admin");
            } else {
              if (typeof foundName !== undefined) {
                newHashIdToken = `${hashIdToken}:${user}`;
                tokenCheck = newHashIdToken;
                res.cookie(`newIdToken`, newHashIdToken, { httpOnly: true });
                res.send("/client");
              } else { console.log("usuario nao existe") }
            }
          }
        });
      } else { res.redirect("/loginpage") }
    })

  } catch (err) {
    console.error('Error');
  }
});

///////////////////////////////////////
///////////SIGNIN DATA////////////////
/////////////////////////////////////

app.post('/signinuser', (req, res) => {
  try {
    const user = req.body.user;
    const name = req.body.name;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const password = req.body.password;

    fs.readFile('./users.json', function (err, data) {
      const dataUser = JSON.parse(data);
      userId = Object.keys(dataUser).length + 1;
    });

    bcrypt.hash(password, saltRounds, function (err, hash) {
      const newUser = {
        'userName': user,
        'name': name,
        'docId': cpf,
        'email': email,
        'password': hash,
        'class': "user",
        'active': "true"
      };

      fs.readFile('./users.json', function (err, data) {
        const dataUser = JSON.parse(data);
        let foundName = false;
        let foundEmail = false;

        for (let key in dataUser) {
          if (dataUser[key].email === email) {
            foundEmail = true;
            console.log("Email repetido")
            return true;
          }
          if (dataUser[key].userName === user) {
            foundName = true;
            console.log("nome de usuário repetido")
            return true;
          }
        }

        if (foundName === false && foundEmail === false) {
          dataUser[userId] = newUser;

          fs.writeFile("./users.json", JSON.stringify(dataUser), function () {
          })

          res.send("/loginpage");
        } else {
          res.send("");
        }
      });
    });

  } catch (err) {
    console.error('Error');
  }
});

///////////////////////////////////////
///////////TICKET DATA////////////////   TICKET == EVENT
/////////////////////////////////////

app.post('/ticket', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const eventCode = req.body.eventCode;
      const eventName = req.body.eventName;
      const eventDescription = req.body.eventDescription;
      const eventDate = req.body.eventDate;
      const eventPlace = req.body.eventPlace;

      fs.readFile('./events.json', function (err, data) {
        const dataTicket = JSON.parse(data);

        const newEvent = {
          "eventName": eventName,
          "eventDescription": eventDescription,
          "eventDate": eventDate,
          "eventPlace": eventPlace,
          "userJoin": {}
        };

        dataTicket[eventCode] = newEvent;

        fs.writeFile(`./events.json`, JSON.stringify(dataTicket), function () {
        }); //{ flag: `as` },

        res.send(newEvent);
      })
    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage"); }
});

/////////////////////////////////////////////////
//TICKET DATA SHOW WHAT USER DIDNT BOUGHT///////   TICKET == EVENT
///////////////////////////////////////////////

app.get('/ticket', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  let checkEvent;
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const getUserIdFromToken = newIdToken.split(":")[1];
      let allEventsNotBought = {};
      fs.readFile("./events.json", function (err, data) {
        const dataEvent = JSON.parse(data);

        for (let key in dataEvent) {
          checkEvent = false;
          if (Object.keys(dataEvent[key].userJoin).length > 0) {
            for (let id in dataEvent[key].userJoin) {
              if (id === getUserIdFromToken) {
                checkEvent = true;
              }
            }
            if (checkEvent !== true) {
              allEventsNotBought[key] = dataEvent[key]
            } else { allEventsBought[key] = dataEvent[key] }
          } else { allEventsNotBought[key] = dataEvent[key] }
        }

        res.send(allEventsNotBought);
      })
    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage"); }
});

///////////////////////////////////////
//SAVE DATA USER IN FILE EVENTS.JS////   
/////////////////////////////////////

app.post('/joinEvent', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const getUserIdFromToken = newIdToken.split(":")[1];
      const eventName = req.body.eventName;

      fs.readFile('./users.json', function (err, data) {
        const dataUser = JSON.parse(data);

        const userJoinEventContent = {
          name: dataUser[getUserIdFromToken].name,
          docId: dataUser[getUserIdFromToken].docId,
          token: newIdToken,
          activeQRCode: true
        };
        fs.readFile("./events.json", function (err, data) {
          const dataEvent = JSON.parse(data);

          dataEvent[eventName].userJoin[getUserIdFromToken] = userJoinEventContent;

          fs.writeFile(`./events.json`, JSON.stringify(dataEvent), function () {
          });
        });
      });

    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage") }
});

/////////////////////////////////////////////////
////////TICKET DATA SHOW WHAT USER BOUGHT///////   TICKET == EVENT
///////////////////////////////////////////////

app.get('/eventboughtcards', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const getUserIdFromToken = newIdToken.split(":")[1];
      let allEventsNotBought = {};
      fs.readFile("./events.json", function (err, data) {
        const dataEvent = JSON.parse(data);

        for (let key in dataEvent) {
          checkEvent = false;
          if (Object.keys(dataEvent[key].userJoin).length > 0) {
            for (let id in dataEvent[key].userJoin) {
              if (id === getUserIdFromToken) {
                checkEvent = true;
              }
            }
            if (checkEvent !== true) {
              allEventsNotBought[key] = dataEvent[key]
            } else { allEventsBought[key] = dataEvent[key] }
          } else { allEventsNotBought[key] = dataEvent[key] }
        }

        res.send(allEventsBought);
      })
    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage") }
});

///////////////////////////////////////
//SHOW QRCODE WHEN CLICK ON EVENT/////   
/////////////////////////////////////

app.post('/sendeventboughtcards', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const getUserIdFromToken = newIdToken.split(":")[1];
      const eventName = req.body.eventName;

      fs.readFile("./events.json", function (err, data) {
        const dataEvent = JSON.parse(data);
        res.send(dataEvent[eventName].userJoin[getUserIdFromToken].token)
      })
    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage") }
});


///////////////////////////////////////
///////////CANCEL EVENT///////////////
/////////////////////////////////////

app.post('/cancelevent', function (req, res) {
  const newIdToken = req.cookies[`newIdToken`];
  if (newIdToken && newIdToken === tokenCheck) {
    try {
      const newIdToken = req.cookies[`newIdToken`];
      const getUserIdFromToken = newIdToken.split(":")[1];
      const eventName = req.body.eventName;
      let allUsersJoinedButThisOne = {};
      let catchEventsBougth = {};
      fs.readFile("./events.json", function (err, data) {
        const dataEvent = JSON.parse(data);

        if (Object.keys(dataEvent[eventName].userJoin).length > 1) {
          for (let id in dataEvent[eventName].userJoin) {
            if (id !== getUserIdFromToken) {
              allUsersJoinedButThisOne[id] = dataEvent[eventName].userJoin[id];
              // dataEvent[eventName].userJoin = allUsersJoinedButThisOne;
              for (let key in allEventsBought) {
                if (Object.keys(allEventsBought).length > 1) {
                  if (key !== eventName) {
                    catchEventsBougth[key] = dataEvent[key];
                  }
                }
              }
            }
          }
        } else {
          dataEvent[eventName].userJoin = {}
          for (let key in allEventsBought) {
            if (Object.keys(allEventsBought).length > 1) {
              if (key !== eventName) {
                catchEventsBougth[key] = dataEvent[key];
              }
            }
          }
        }

        dataEvent[eventName].userJoin = allUsersJoinedButThisOne;
        allEventsBought = catchEventsBougth;
        fs.writeFile(`./events.json`, JSON.stringify(dataEvent), function () {
        });
      });

    } catch (err) {
      console.error('Error');
      res.redirect("/loginpage");
    }
  } else { res.redirect("/loginpage") }
});

app.listen(8080);