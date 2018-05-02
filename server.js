const express = require('express');
const fs = require('fs');
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

app.get('/images/:path', (req, res) => {
  const { path } = req.params;
  if (['a', 'i', 'u', 'e', 'o'].includes(path)) {
    const files = fs.readdirSync(`./images/${path}`);
    files.forEach(file => {
      fs.createReadStream(`./images/${path}/939c4.png`)
        .pipe(new PNG({
          filterType: 4
        }))
        .on('data', chunk => console.log(chunk))
        .on('parsed', data => {
          console.log(this.data);
        })

        
        
    });
  }
});
