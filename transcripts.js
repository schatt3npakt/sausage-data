import { YoutubeTranscript } from "youtube-transcript";
import fs from "fs";
import sausages from "./public/sausages.json" assert { type: "json" };
import nses from "./public/nse.json" assert { type: "json" };

class TranscriptFetcher {
  /**
   * Fetches the transcript for a given video ID and saves it to a file.
   * @param {string} id - The video ID.
   * @param {number} index - The index of the transcript.
   * @param {string} path - The path where the transcript file will be saved.
   * @returns {Promise<void>} - A promise that resolves when the transcript has been saved.
   */
  async #fetchTranscriptAndSaveToFile(id, index, path) {
    console.log(id, index, path);
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

  /**
   * Fetches and saves transcripts for all sausages from ./public/sausages.json.
   * @private
   * @returns {Promise<void>} A promise that resolves when all transcripts are fetched and saved.
   */
  async #fetchAllSausageTranscripts() {
    for (const sausage of sausages) {
      // skip removed videos
      if ([415, 430].includes(sausage.id)) {
        continue;
      }

      // skip already downloaded transcript
      const filePath = `./transcripts/raw/sausages/${sausage.id}.json`;
      if (await fs.existsSync(filePath)) {
        continue;
      }

      await this.#fetchTranscriptAndSaveToFile(
        sausage.episodeID,
        sausage.id,
        "./transcripts/raw/sausages/"
      );
    }
  }

  /**
   * Fetches and saves transcripts for all NSE episodes.
   * @private
   * @async
   * @returns {Promise<void>}
   */
  async #fetchAllNseTranscripts() {
    for (const nse of nses) {
      // skip removed videos
      if ([12, 25, 97].includes(nse.id)) {
        continue;
      }

      // skip already downloaded transcript
      const filePath = `./transcripts/raw/nse/${nse.id}.json`;
      if (await fs.existsSync(filePath)) {
        continue;
      }

      await this.#fetchTranscriptAndSaveToFile(
        nse.episodeID,
        nse.id,
        "./transcripts/raw/nse/"
      );
    }
  }

  /**
   * Parses the raw transcript data and saves it to a concactenated json for easier querying.
   * @param {number} index - The index of the transcript.
   * @param {string} type - The type of the transcript, sauasges or nse.
   * @returns {Promise<void>} - A promise that resolves when the transcript has been parsed and saved.
   */
  async #parseTranscriptAndSaveToFile(index, type) {
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

  /**
   * Parses all NSE transcripts.
   * @private
   * @returns {Promise<void>} A promise that resolves when all transcripts are parsed and saved.
   */
  async #parseAllNseTranscripts() {
    for (const nse of nses) {
      // skip removed videos
      if ([12, 25, 97].includes(nse.id)) {
        continue;
      }

      await this.#parseTranscriptAndSaveToFile(nse.id, "nse");
    }
  }

  /**
   * Parses all sausage transcripts and saves them to files.
   * @private
   * @returns {Promise<void>} A Promise that resolves when all transcripts have been parsed and saved.
   */
  async #parseAllSausageTranscripts() {
    for (const sausage of sausages) {
      // skip removed videos
      if ([415, 430].includes(sausage.id)) {
        continue;
      }

      console.log("sausage: " + sausage.id);

      await this.#parseTranscriptAndSaveToFile(sausage.id, "sausages");
    }
  }

  /**
   * Reads all JSON files in the transcripts/parsed/nse folder and writes them into one JSON file.
   * @returns {Promise<void>} A promise that resolves when the files are read and merged into one JSON file.
   */
  async #mergeTranscripts(type) {
    const path = "./transcripts/parsed/" + type + "/";
    const files = fs.readdirSync(path);
    let mergedData = {};
    for (const file of files) {
      const data = fs.readFileSync(path + file, "utf-8");
      const parsedData = JSON.parse(data);
      const index = file.split(".")[0];
      mergedData[index] = parsedData;
    }
    fs.writeFile(
      "./transcripts/parsed/full/" + type + ".json",
      JSON.stringify(mergedData, null, 2),
      (err) => {
        if (err) throw err;
        console.log("Merged NSE transcripts have been saved!");
      }
    );
  }

  /**
   * Fetches and parses NSE transcripts.
   * @returns {Promise<void>} A promise that resolves when the transcripts are fetched and parsed.
   */
  async fetchAndParseNseTranscripts() {
    await this.#fetchAllNseTranscripts();
    await this.#parseAllNseTranscripts();
    this.#mergeTranscripts("nse");
  }

  /**
   * Fetches and parses sausage transcripts.
   * @returns {Promise<void>} A promise that resolves when the fetching and parsing is complete.
   */
  async fetchAndParseSausageTranscripts() {
    await this.#fetchAllSausageTranscripts();
    await this.#parseAllSausageTranscripts();
    this.#mergeTranscripts("sausages");
  }
}

const fetcher = new TranscriptFetcher();
await fetcher.fetchAndParseNseTranscripts();
await fetcher.fetchAndParseSausageTranscripts();
