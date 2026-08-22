#!/usr/bin/env node
// Submit every URL in the live sitemap to IndexNow, the push protocol Bing,
// Seznam and Yandex share. Google does not participate — its side of the work
// is the sitemap in Search Console.
//
//   node scripts/indexnow.mjs                     # submit https://apexgold.cz
//   node scripts/indexnow.mjs https://apexgold.cz # explicit host
//
// Ownership is proved by a key file served from the site root, so the key must
// already be deployed before a submission is accepted: public/<key>.txt holds
// exactly the key that names it. That self-describing pair is what this script
// reads, which is why there is no key to keep in sync anywhere else.

import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ENDPOINT = "https://api.indexnow.org/IndexNow";
const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

/** The one file in /public whose contents equal its own basename. */
async function readKey() {
  const candidates = (await readdir(PUBLIC_DIR)).filter((f) => f.endsWith(".txt"));
  for (const file of candidates) {
    const key = file.slice(0, -4);
    const body = (await readFile(join(PUBLIC_DIR, file), "utf8")).trim();
    if (body === key) return key;
  }
  throw new Error(
    `No IndexNow key found in ${PUBLIC_DIR}. Create one with:\n` +
      `  KEY=$(openssl rand -hex 16); printf %s "$KEY" > public/$KEY.txt`
  );
}

async function sitemapUrls(origin) {
  const res = await fetch(`${origin}/sitemap.xml`);
  if (!res.ok) throw new Error(`GET ${origin}/sitemap.xml -> ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const origin = (process.argv[2] || "https://apexgold.cz").replace(/\/$/, "");
const host = new URL(origin).host;
const key = await readKey();

// The key has to be reachable on the live host, or every submission is rejected
// as unverified. Fail here rather than after a silent 403 from the API.
const keyUrl = `${origin}/${key}.txt`;
const keyRes = await fetch(keyUrl);
if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
  throw new Error(`${keyUrl} does not serve the key yet — deploy first, then rerun.`);
}

const urlList = await sitemapUrls(origin);
console.log(`Submitting ${urlList.length} URLs from ${origin}/sitemap.xml as ${host}`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: keyUrl, urlList }),
});

// 200 = accepted, 202 = accepted but the key is still being validated. Both mean
// the URLs are queued; anything else carries a reason in the body.
if (res.status === 200 || res.status === 202) {
  console.log(`OK (${res.status}) — queued for Bing, Seznam and Yandex.`);
} else {
  console.error(`Rejected (${res.status}): ${await res.text()}`);
  process.exit(1);
}
