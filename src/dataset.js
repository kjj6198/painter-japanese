// @flow

import * as tf from '@tensorflow/tfjs';

// [TODO]: determine constant dynamically.
const IMAGE_SIZE: number = 150 * 150 * 4;
const NUM_DATASET: number = 607;
const NUM_TEST_SET: number = Math.floor(NUM_DATASET * (1 / 5));
const NUM_TRAIN_SET: number = Math.floor(NUM_DATASET * (4 / 5));
const NUM_CLASS: number = 5;

const DATASET_PATH: string = 'http://localhost:3000/images/all'; 
const LABELS_PATH: string = 'http://localhost:3000/labels';

export default class JapaneseDataSet {
  trainIndices: Uint32Array = tf.util.createShuffledIndices(NUM_TRAIN_SET);
  testIndices: Uint32Array = tf.util.createShuffledIndices(NUM_TEST_SET);
  trainImages: Uint8Array;
  testImages: Uint8Array;
  images: ArrayBuffer;
  labels: Uint8Array;
  trainLabels: Uint8Array;
  testLabels: Uint8Array;
  shuffledTrainIdx: number = 0;
  shuffledTestIdx: number = 0;

  async load() {
    const imagesRequest = await fetch('http://localhost:3000/images/all');
    this.images = await imagesRequest.arrayBuffer();
    this.trainImages = new Uint8Array(this.images.slice(0, IMAGE_SIZE * NUM_TRAIN_SET));
    this.testImages = new Uint8Array(this.images.slice(IMAGE_SIZE * NUM_TRAIN_SET));
    
    const labelsRequest = await fetch('http://localhost:3000/labels');
    this.labels = new Uint8Array(await labelsRequest.arrayBuffer());
    this.trainLabels = this.labels.slice(0, NUM_CLASS * NUM_TRAIN_SET);
    this.testLabels = this.labels.slice(NUM_CLASS * NUM_TRAIN_SET);
    window.labels = this.labels;
  }

  nextTrainBatch(batchSize: number) {
    return this.nextBatch(
      batchSize,
      this.trainImages,
      this.trainLabels,
      () => {
        this.shuffledTrainIdx = (this.shuffledTrainIdx + 1) % this.trainIndices.length;
        return this.trainIndices[this.shuffledTrainIdx];
      }
    );
  }

  nextTestBatch(batchSize: number) {
    return this.nextBatch(
      batchSize,
      this.testImages,
      this.testLabels,
      () => {
        this.shuffledTestIdx = (this.shuffledTestIdx + 1) % this.testIndices.length;
        return this.testIndices[this.shuffledTestIdx];
      }
    );
  }

  nextBatch(batchSize: number, images: Uint8Array, labels: Uint8Array, getIdxFn: () => number) {
    const batchImages = new Uint8Array(batchSize * IMAGE_SIZE);
    const batchLabels = new Uint8Array(batchSize * NUM_CLASS);

    for (let i = 0; i < batchSize; i++) {
      const idx: number = getIdxFn();
      const image = images.slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
      batchImages.set(image, i * IMAGE_SIZE);
      const label = labels.slice(idx * NUM_CLASS, idx * NUM_CLASS + NUM_CLASS);
      batchLabels.set(label, i * NUM_CLASS);
    }

    const xs = tf.tensor2d(batchImages, [batchSize, IMAGE_SIZE]);
    console.log('hello world');
    const labelsTensor = tf.tensor2d(batchLabels, [batchSize, NUM_CLASS]);

    return {
      xs,
      labels: labelsTensor,
    }
  }
}