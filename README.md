# Sausage Data

This project provides data for [thesausagedatabase.com](https://www.thesausagedatabase.com). Data is available as two huge ass JSONs for sausaegs and NSEs.

Sausages: https://schatt3npakt.github.io/sausage-data/sausages.json
Non-Sausage Episode Meals: https://schatt3npakt.github.io/sausage-data/nse.json

To consume the data, just fetch the resprective file:

```javascript
fetch("https://schatt3npakt.github.io/sausage-data/sausages.json")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Transcript generation

To generate transcripts for all episodes, run

```bash
node transcripts.js
cp ./transcripts/parsed/full/nse-transcript.json ./public
cp ./transcripts/parsed/full/sausages-transcript.json ./public
```
