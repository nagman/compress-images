import { readdirSync } from 'fs';
import path from 'path';
import { options, sizes, SRC_DIR } from './config.mjs';

export function getFrames() {
	const filenames = readdirSync(path.join(SRC_DIR));
	const sortedFiles = filenames.map((filename) => ({
		index: parseInt(filename.slice(1)),
		filename,
	}));

	return sortedFiles;
}

const colors = {
	reset: '\x1B[0m',
	green: '\x1B[32m',
	yellow: '\x1B[33m',
	magenta: '\x1B[35m',
	cyan: '\x1B[36m',
};

export function color(color, string) {
	return `${colors[color]}${string}${colors.reset}`;
}

// all formats and sizes in one array
const formats = Object.entries(options);
export const formatsAndSizes = sizes
	.map(({ height, width }) =>
		formats.map(([ext, options]) => ({ width, height, ext, options })),
	)
	.flat();

export function nbr2seconds(ms, decimals = 0) {
	return (Math.round(ms / 100) / 10).toFixed(decimals) + ' s';
}

export function printLog({ duration, filename, threadId }) {
	const columns = [
		color('cyan', filename),
		color('magenta', 'worker ' + threadId),
		color('green', nbr2seconds(duration, 1)),
	];
	console.log(`${columns.join(' | ')}`);
}

export function partition(list = [], n = 1) {
	const isPositiveInteger = Number.isSafeInteger(n) && n > 0;
	if (!isPositiveInteger) {
		throw new RangeError('n must be a positive integer');
	}

	const partitions = [];
	const partitionLength = Math.ceil(list.length / n);

	for (let i = 0; i < list.length; i += partitionLength) {
		const partition = list.slice(i, i + partitionLength);
		partitions.push(partition);
	}

	return partitions;
}
