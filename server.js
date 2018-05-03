const express = require('express');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const app = express();

const seenKeys = {};
const MULTIPLIER = Math.pow(2, 24);

const labels = ['あ', 'い', 'う', 'え', 'お'];

function generateRandomKey() {
  let key;
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }
  seenKeys[key] = true;
  return key;
}

function onRequest(req, res) {
  req
    .on('data', chunk => {
      const base64Data = chunk.toString().replace(/^data:image\/png;base64,/, '');
      fs.writeFile(
        `./images/o/${generateRandomKey()}.png`,
        base64Data,
        { encoding: 'base64' },
        (err) => console.log(err)
      );
    });
    
  res.end();
}

app.listen(3000);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/', (req, res) => {
  req
    .on('data', chunk => {
      const base64Data = chunk.toString().replace(/^data:image\/png;base64,/, '');
      fs.writeFile(
        `./images/o/${generateRandomKey()}.png`,
        base64Data,
        { encoding: 'base64' },
        (err) => {
          if (err) {
            return res.status(400).json({ error: err });
          }

          return res.send('ok');
        }
      );
    });
});



app.get('/images/:dirpath', (req, res) => {
  const { dirpath } = req.params;
  
  if (['a', 'i', 'u', 'e', 'o'].includes(dirpath)) {
    const files = fs
      .readdirSync(`./images/${dirpath}`)
      .filter(filename => filename !== '.DS_Store');

    Promise.all(files.map(file => {
      return new Promise(resolve => {
        fs.createReadStream(`./images/${dirpath}/${file}`)
        .pipe(new PNG({ filterType: 4 }))
        .on('parsed', (data) => {
          resolve(data);
        });
      })
    }))
    .then(images => res.send(Buffer.concat(images)));
  }
});
