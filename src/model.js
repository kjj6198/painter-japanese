import * as tf from '@tensorflow/tfjs';

const model: tf.Sequential = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [150, 150, 1],
  kernelSize: 5,
  filters: 8,
  strides: 2,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling',
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [3, 3],
  strides: [2, 2],
}));

model.add(tf.layers.conv2d({
  kernelSize: 5,
  filter: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling',
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  strides: [2, 2],
}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
  unit: 10,
  kernelInitializer: 'VarianceScaling',
  activation: 'softmax',
}));

const LERANING_RATE = 0.15;
const optimizer: tf.SGDOptimizer = tf.train.sgd(LERANING_RATE);