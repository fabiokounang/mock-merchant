const port = process.env.PORT || 3000;
const crypto = require('crypto');
const e = require('express');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const fs = require('fs').promises;
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);

server.use(async (req, res, next) => {
  const body = req.body;
  if (req.method === "POST") {
    if (req.url === '/signup' || req.url === '/resend_otp_signup') {
      if (body.email === 'emailsuccess@gmail.com') {
        res.json({
          status: true,
          data: {
            email: body.email,
            expire: Date.now() + 60000
          }
        });
      } else {
        res.json({
          status: false,
          error: "Error message " + req.url.split('/')[1]
        });
      }
    }

    if (req.url === '/verification_otp_signup') {
      if (req.body.otp === '0000') {
        res.json({
          status: true
        });
      } else {
        if (req.body.otp === '3333') {
          res.json({
            status: false,
            counter: 3,
            error: "Please fill captcha"
          });
        } else {
          res.json({
            status: false,
            counter: 1,
            error: "Error message verification otp"
          });
        }
      }
    }

    if (req.url === '/signin') {
      if (body.email === 'emailsuccess@gmail.com') {
        const file = JSON.parse(await fs.readFile('db.json'));
        const d = file.signup.find(val => val.email === body.email);
        res.json({
          status: true,
          data: {
            id: d.id,
            email: d.email,
            token: crypto.randomBytes(128).toString('base64')
          }
        });
      } else {
        if (body.email === 'emailcaptcha@gmail.com') {
          res.json({
            status: false,
            counter: 3,
            error: "Please fill captcha"
          });
        } else {
          res.json({
            status: false,
            counter: 1,
            error: "Error message signin"
          });
        }
      }
    }

    if (req.url === '/forget_password') {
      if (body.email === 'emailsuccess@gmail.com') {
        res.json({
          status: true,
          expire: Date.now() + 60000
        });
      } else {
        res.json({
          status: false,
          error: "Error message forget password"
        });
      }
    }

    if (req.url === '/verification_otp_forget_password') {
      if (req.body.otp === '0000') {
        res.json({
          status: true
        });
      } else {
        if (req.body.otp === '3333') {
          res.json({
            status: false,
            counter: 3,
            error: "Please fill captcha"
          });
        } else {
          res.json({
            status: false,
            counter: 1,
            error: "Error message verification otp"
          });
        }
      }
    }

    if (req.url === '/reset_password') {
      if (body.password === "qweqwe123") {
        res.json({
          status: true
        });
      } else {
        res.json({
          status: false,
          error: "Error message reset password"
        });
      }
    }
  } else{
    next();
  }
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log('Listening to port ' + port);
});