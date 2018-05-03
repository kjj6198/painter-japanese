const express = require('express');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const app = express();
app.disable('etag');
const seenKeys = {};
const MULTIPLIER = Math.pow(2, 24);

function generateRandomKey() {
  let key;
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }
  seenKeys[key] = true;
  return key;
}

function buildLabels() {
  const labels = ['あ', 'い', 'う', 'え', 'お'];
  const labelMatrix = {
    a: [1, 0, 0, 0, 0],
    i: [0, 1, 0, 0, 0],
    u: [0, 0, 1, 0, 0],
    e: [0, 0, 0, 1, 0],
    o: [0, 0, 0, 0, 1],
  };

  const cache = {};
  ['a', 'i', 'u', 'e', 'o']
    .forEach(dir => {
      const files = fs.readdirSync(`./images/${dir}`)
        .filter(file => file !== '.DS_Store');
      files.forEach(file => {
        cache[file] = labelMatrix[dir];
      });
    });

  return () => {
    return cache;
  }
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/images/all', (req, res) => {
  const files = fs
      .readdirSync('./images/all')
      .filter(filename => filename !== '.DS_Store');
  
  Promise.all(files.sort().map(file => {
    return new Promise(resolve => {
      fs.createReadStream(`./images/all/${file}`)
      .pipe(new PNG({ filterType: 4 }))
      .on('parsed', (data) => {
        resolve(data);
      });
    })
  }))
  .then(images => res.send(Buffer.concat(images)))
  .catch(err => res.status(400).json({ error: err }))
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

app.get('/labels', (req, res) => {
  const makeLabels = buildLabels();
  const labels = makeLabels();
  console.log(Object.keys(labels));
  const resultInOrder = Object
    .keys(labels)
    .sort()
    .reduce((acc, current) => acc.concat(labels[current]) , []);
  res.send(Buffer.from(resultInOrder));
});

app.listen(3000);