// @flow
import * as tf from '@tensorflow/tfjs';
import JapaneseDataSet from './dataset';

const model = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [150, 150, 4],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  stride: [2, 2],
}));

model.add(tf.layers.conv2d({
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling',
}));

model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
model.add(tf.layers.flatten());
model.add(tf.layers.dense(
    {units: 5, kernelInitializer: 'varianceScaling', activation: 'softmax'}));

const LEARNING_RATE = 0.5;
const optimizer = tf.train.sgd(LEARNING_RATE);
model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

const BATCH_SIZE = 30;
const TRAIN_BATCHES = 100;

const TEST_BATCH_SIZE = 10;
const TEST_ITERATION_FREQUENCY = 5;


export async function train(data: JapaneseDataSet) {
  const lossValues = [];
  const accuracyValues = [];

  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = data.nextTrainBatch(BATCH_SIZE);
    console.log(lossValues);

    let testBatch;
    let validationData;
    // Every few batches test the accuracy of the mode.
    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, 150, 150, 4]), testBatch.labels
      ];
    }

    // The entire dataset doesn't fit into memory so we call fit repeatedly
    // with batches.
    const history = await model.fit(
        batch.xs.reshape([BATCH_SIZE, 150, 150, 4]), batch.labels,
        {batchSize: BATCH_SIZE, validationData, epochs: 1});

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

    // Plot loss / accuracy.
    lossValues.push({'batch': i, 'loss': loss, 'set': 'train'});

    if (testBatch != null) {
      accuracyValues.push({'batch': i, 'accuracy': accuracy, 'set': 'train'});
    }

    batch.xs.dispose();
    batch.labels.dispose();
    if (testBatch != null) {
      testBatch.xs.dispose();
      testBatch.labels.dispose();
    }

    await tf.nextFrame();
  }
}

export async function showPredictions(data: JapaneseDataSet) {
  const testExamples = 100;
  const batch = data.nextTestBatch(testExamples);

  tf.tidy(() => {
    const output = model.predict(batch.xs.reshape([-1, 150, 150, 4]));

    const axis = 1;
    const labels = Array.from(batch.labels.argMax(axis).dataSync());
    const predictions = Array.from(output.argMax(axis).dataSync());
    console.log(batch, predictions, labels);
    showResult(batch, predictions, labels);
  });
}

function getPrediction(prediction) {
  return ['あ', 'い', 'う', 'え', 'お'][prediction];
}

export function showResult(batch, predictions, labels) {
  const statusElement = document.getElementById('statusElement');
  statusElement.innerText = 'Testing...';

  const testExamples = batch.xs.shape[0];
  let totalCorrect = 0;
  for (let i = 0; i < testExamples; i++) {
    const image: tf.Tensor2D = batch.xs.slice([i, 0], [1, batch.xs.shape[1]]);

    const canvas = document.createElement('canvas');
    canvas.className = 'prediction-canvas';
    
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(new Uint8ClampedArray(image.flatten().dataSync()), 150, 150);
    ctx.putImageData(imageData, 0, 0);

    const prediction = predictions[i];
    const label = labels[i];
    const correct = prediction === label;

    const predContainer = document.getElementById('pred');
    const display = document.createElement('p');
    display.innerText = `pred: ${getPrediction(prediction)} real: ${getPrediction(label)}`;
    predContainer.appendChild(display);
    result.appendChild(canvas);
  }
}