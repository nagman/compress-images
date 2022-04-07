import path from 'path';
import { __dirname } from './dirname.mjs';

export const SRC_DIR = path.join(__dirname, './images/originals');
export const DEST_DIR = path.join(__dirname, './images/compressed');

export const sizes = [
	{ width: 1920, height: 1440 },
	{ width: 1440, height: 1080 },
	{ width: 1024, height: 768 },
];

export const options = {
	avif: { quality: 55 },
	webp: { quality: 40 },
	png: { quality: 40 },
};
