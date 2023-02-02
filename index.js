const port = process.env.PORT || 3000;
const crypto = require('crypto');

const jsonServer = require('json-server');
const multer = require('multer');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const fs = require('fs').promises;
const middlewares = jsonServer.defaults();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: {
  fileSize: 2 * 1024 * 1024
} }).fields([
  { name: 'photo_ktp', maxCount: 1 },
  { name: 'photo_selfie', maxCount: 1 },
  { name: 'photo_usaha', maxCount: 1 },
]);

server.use(jsonServer.bodyParser);
server.use(upload);

server.use(async (req, res, next) => {
  const body = req.body;
  if (req.method === "POST") {
    if (req.url === '/signup' || req.url === '/resend_otp_signup') {
      if (body.email === 'emailsuccess@gmail.com' || body.email === 'emailkyb@gmail.com') {
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
            status: 1,
            status_kyb: 0,
            token: crypto.randomBytes(128).toString('base64')
          }
        });
      } else if (body.email === 'emailkyb@gmail.com') {
        const file = JSON.parse(await fs.readFile('db.json'));
        const d = file.signup.find(val => val.email === body.email);
        res.json({
          status: true,
          data: {
            id: d.id,
            email: d.email,
            status: 1,
            status_kyb: 1,
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

    if (req.url === '/balance_main/1') {
      res.json({
        status: true,
        data: {
          balance: 1000000
        }
      });
    } else if (req.url === '/balance_main/2') {
      res.json({
        status: true,
        data: {
          balance: 2000000
        }
      });
    }

    if (req.url === '/request_kyb') {
      if (body.merchant_email === 'emailsuccesskyb@gmail.com') {
        res.json({ status: true });
      } else {
        res.json({ status: false, error: "Error message" });
      }
    }

    if (req.url === '/user_usaha/1') {
      res.send({
        status: true,
        data: []
      });
    } else if (req.url === '/user_usaha/2') {
      const page = body.page || 1;
      const limit = body.limit || 5;
      const result = [
        {
          id: 1,
          nama_usaha: "Toko I",
          alamat_usaha: "Jl Gedung Senatama Senen Coto Makassar",
          balance: 10000000,
          status: 1
        },
        {
          id: 2,
          nama_usaha: "Toko II",
          alamat_usaha: "Jl Gedung Senatama Senen Coto Makassar II",
          balance: 100000,
          status: 1
        },
        {
          id: 3,
          nama_usaha: "Toko III",
          alamat_usaha: "Jl Gedung Senatama Senen Coto Makassar II",
          balance: 100000,
          status: 0
        },
        {
          id: 4,
          nama_usaha: "Toko IV",
          alamat_usaha: "Jl Gedung Senatama Senen Coto Makassar II",
          balance: 100000,
          status: 2
        }
      ]
      res.send({
        status: true,
        data: {
          page: page,
          limit: limit,
          max: Math.ceil(result.length / limit),
          total: result.length,
          values: result.slice(page - 1, limit)
        }
      })
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