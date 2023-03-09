import * as functions from "firebase-functions";
import {adminDb} from "./firebaseAdmin";
export const onScraperComplete = functions.https.onRequest(async (request, response)=> {
  const fetchResults:any = async (id: string) => {
    const ApiKey = process.env.BRIGHTDATA_API_KEY;
    const res = await fetch(`https://api.brightdata.com/dca/dataset?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ApiKey}`,
      },
    });
    const data = await res.json();
    if (data.status === "building"||data.status === "collecting") {
      return fetchResults(id);
    }
    return data;
  };
  const {success, id, finished} = request.body;
  if (!success) {
    await adminDb.collection("searches").doc(id).set({
      status: "error",
      updatedAt: finished,
    }, {
      merge: true,
    });
  }
  const data = await fetchResults(id);
  await adminDb.collection("searches").doc(id).set({
    status: "complete",
    updatedAt: finished,
    results: data,
  }, {
    merge: true,
  });
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
// https://3ba8-2a02-8308-5082-8900-8551-1285-5d81-8a98.eu.ngrok.io/scraper-ed2df/us-central1/onScraperComplete

