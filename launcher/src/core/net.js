'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

const USER_AGENT = 'EclipseClient/1.0.0-beta (github.com/ojnyxus/eclipse-client)';

async function withRetry(fn, tries = 3) {
  let lastError;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

function getJson(url) {
  return withRetry(async () => {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  });
}

function sha1File(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    fs.createReadStream(file)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', () => resolve(hash.digest('hex')));
  });
}

/** Downloads `url` to `dest`. Skips the download when `dest` already matches `sha1`. */
async function downloadFile(url, dest, { sha1 } = {}) {
  if (sha1 && fs.existsSync(dest) && (await sha1File(dest)) === sha1) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.part`;
  await withRetry(async () => {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${url}`);
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
    if (sha1 && (await sha1File(tmp)) !== sha1) {
      fs.rmSync(tmp, { force: true });
      throw new Error(`Checksum mismatch for ${url}`);
    }
  });
  fs.renameSync(tmp, dest);
  return true;
}

/** Runs `worker` over `items` with at most `limit` running at once. */
async function runPool(items, limit, worker) {
  let next = 0;
  async function lane() {
    while (next < items.length) {
      const index = next++;
      await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
}

/** Joins `rel` onto `base`, refusing paths that escape `base`. */
function safeJoin(base, rel) {
  const full = path.resolve(base, rel);
  if (full !== path.resolve(base) && !full.startsWith(path.resolve(base) + path.sep)) {
    throw new Error(`Refusing path outside of ${base}: ${rel}`);
  }
  return full;
}

module.exports = { USER_AGENT, getJson, downloadFile, runPool, safeJoin, withRetry };
