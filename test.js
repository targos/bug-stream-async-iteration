'use strict';

const { createReadStream } = require('fs');

const pipeline = require('@targos/pumpify');
const split2 = require('split2');
const through2 = require('through2');

function numberStream() {
  return pipeline.obj(
    split2('\n'),
    through2({ objectMode: true }, function(value, encoding, callback) {
      this.push(Number(value));
      callback();
    })
  );
}

async function test() {
  console.log('start');

  const reader = createReadStream('data.txt');
  const numbers = reader.pipe(numberStream());

  for await (const value of numbers) {
    console.log(value);
    throw new Error('BOOM'); // Loop hangs here and the Promise does not reject
  }

  console.log('end');
}

test().catch((e) => console.log('error', e));
