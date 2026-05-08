#!/usr/bin/env node
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");

admin.initializeApp({
  credential: admin.credential.cert(
    require(path.join(os.homedir(), ".config/firebase/pantherlearn-admin.json"))
  ),
});
const db = admin.firestore();

async function wipeRoom(roomDoc) {
  const subcols = ["callerCandidates", "calleeCandidates"];
  for (const sub of subcols) {
    const snap = await roomDoc.ref.collection(sub).get();
    await Promise.all(snap.docs.map((d) => d.ref.delete()));
  }
  await roomDoc.ref.delete();
}

(async () => {
  const rooms = await db.collection("secretChatSignaling").get();
  console.log(`Found ${rooms.size} signaling rooms.`);
  let n = 0;
  for (const r of rooms.docs) {
    await wipeRoom(r);
    n++;
    if (n % 25 === 0) console.log(`  wiped ${n}/${rooms.size}`);
  }
  console.log(`Done. Wiped ${n} rooms (and their subcollections).`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
