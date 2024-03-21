import { YoutubeTranscript } from "youtube-transcript";
import fs from "fs";
import sausages from "./sausages.json" assert { type: "json" };
import nses from "./nse.json" assert { type: "json" };

async function fetchTranscriptAndSaveToFile(id, index, path) {
  await YoutubeTranscript.fetchTranscript(id).then(
    async (fetchedTranscript) => {
      fs.writeFile(
        path + index + ".json",
        JSON.stringify(fetchedTranscript, null, 2),
        (err) => {
          if (err) throw err;
          console.log("Transcript has been saved!");
        }
      );
    }
  );
}

async function fetchAllSausageTranscripts() {
  for (const sausage of sausages) {
    // skip removed videos
    if ([415, 430].includes(sausage.id)) {
      continue;
    }
    await fetchTranscriptAndSaveToFile(
      sausage.episodeID,
      sausage.id,
      "./transcripts/raw/sausages/"
    );
  }
}

async function fetchAllNseTranscripts() {
  for (const nse of nses) {
    // skip removed videos
    if ([12, 25, 97].includes(nse.id)) {
      continue;
    }
    await fetchTranscriptAndSaveToFile(
      nse.episodeID,
      nse.id,
      "./transcripts/raw/nse/"
    );
  }
}

async function parseTranscriptAndSaveToFile(index, type) {
  await fs.readFile(
    "./transcripts/raw/" + type + "/" + index + ".json",
    "utf-8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let input = JSON.parse(data);
      let parsedData = "";

      for (const entry of input) {
        parsedData += entry.text + " ";
      }

      parsedData.replaceAll("[Music]", "");
      parsedData.replaceAll("  ", " ");

      fs.writeFile(
        "./transcripts/parsed/" + type + "/" + index + ".json",
        JSON.stringify(parsedData, null, 2),
        (err) => {
          if (err) throw err;
          console.log("Transcript has been parsed!");
        }
      );
    }
  );
}

async function parseAllNseTranscripts() {
  for (const nse of nses) {
    // skip removed videos
    if ([12, 25, 97].includes(nse.id)) {
      continue;
    }
    await parseTranscriptAndSaveToFile(nse.id, "nse");
  }
}

async function parseAllSausageTranscripts() {
  for (const sausage of sausages) {
    // skip removed videos
    if ([415, 430].includes(sausage.id)) {
      continue;
    }

    await parseTranscriptAndSaveToFile(sausage.id, "sausages");
  }
}

// fetchAllSausageTranscripts();
// fetchAllNseTranscripts();
// parseAllNseTranscripts();
// parseAllSausageTranscripts();

// fetchTranscriptAndSaveToFile("OJal60m6XiY", 414, "./transcripts/raw/sausages/");
