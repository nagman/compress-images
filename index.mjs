import { readdirSync } from 'fs';
import { StaticPool } from 'node-worker-threads-pool';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { SRC_DIR } from './config.mjs';
import { __dirname } from './dirname.mjs';
import { color, nbr2seconds, partition, printLog } from './utils.mjs';

const startTime = Date.now();

// Multi-thread config
sharp.concurrency(1); // nbr of threads libvips' should create to process each image
console.log(`concurrency: ${color('yellow', sharp.concurrency())}`);
const numCPUs = 1 || os.cpus().length; // nbr of node workers that will process images (1 image at a time by worker)
console.log(`nbr of workers: ${color('yellow', numCPUs)}`);

// we create a pool of X workers
const workerPath = path.join(__dirname, 'worker.mjs');
const pool = new StaticPool({ size: numCPUs, task: workerPath });

// we get all the frames
const filenames = readdirSync(path.join(SRC_DIR));

// we divide the frames into X equally sizes chunks
const chunks = partition(filenames, numCPUs);

// we asynchronously treat the chunks (1 chunk per worker)
const promises = chunks.map(async (chunk) => {
	// we treat images one after the other
	for (const filename of chunk) {
		const { duration, threadId } = await pool.exec(filename);
		printLog({ duration, filename, threadId });
	}
});
await Promise.all(promises);

const endTime = Date.now();
console.log(`Finished in ${color('green', nbr2seconds(endTime - startTime))}`);
process.exit(1);
