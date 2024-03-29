import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

/* eslint @typescript-eslint/no-var-requires: "off" */
//const serviceAccount = require("../serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();
export { adminDb };
