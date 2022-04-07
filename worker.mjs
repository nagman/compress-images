import { mkdirSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { parentPort, threadId } from 'worker_threads';
import { DEST_DIR, SRC_DIR } from './config.mjs';
import { formatsAndSizes } from './utils.mjs';

parentPort.on('message', async (filename) => {
	const start = Date.now();

	const filePath = path.join(SRC_DIR, filename);

	const transformer = sharp(filePath);

	// we execute the 9 pipelines in parallel for one image on the same thread
	const promises = formatsAndSizes.map(
		async ({ ext, height, options, width }) => {
			const destDir = `${DEST_DIR}/${width}x${height}/${ext}`;
			mkdirSync(destDir, { recursive: true });

			const destFile = path.join(destDir, filename).replace('.png', '.' + ext);
			await transformer
				.clone()
				.resize(width, height)
				.toFormat(ext, options)
				.toFile(destFile);
		},
	);

	await Promise.all(promises);

	const end = Date.now();

	parentPort.postMessage({ duration: end - start, threadId });
});
