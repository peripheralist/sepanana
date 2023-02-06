## Sepanana

Chill UI for interacting with a [Sepana](https://sepana.io/) engine. Not for mobile.

<img width="1468" alt="image" src="https://user-images.githubusercontent.com/79433522/217098305-485aba43-2e51-4cdc-9f06-9625eb8eb9c4.png">

## Usage

1. Paste a Sepana API key into the API Key input. Clicking "Save" will store the key in your browser (localstorage), allowing the app to remember the key after refreshing the page. Click "Saved" to clear a stored key.
2. All engines that this API key has permission to use will be loaded. Select an engine to use from the dropdown menu.
3. Interacting with an engine:
    - Search by any property found in records in that engine. (This may be broken if not all records are uniform)
    - Edit a record. (When editing a record, the app will ensure a changed value matches the type of any existing value)
    - Delete a record.
4. Any update to a Sepana engine will [create a Job](https://docs.sepana.io/sepana-search-api/web3-search-cloud/search-api#job-status). Track the status of Jobs (for the selected engine) in the top right.

## Dev

To run the development server:

```bash
yarn install

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
