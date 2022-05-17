Vision Product Search Browser is a simple tool that allows developers to see products and product sets on Vision Product Search.

## Setup

### Install dependencies

```
yarn
```

### Set up the environment variables

```
cp .env.example .env.local
```

Open `.env` and set three variables below:

- `PROJECT`

    Your google project id(not project number).

- `LOCATION`

    Your location used vision product search. Which one of 'us-west1', 'us-east1', 'asia-east1', 'europe-west1'.

- `GOOGLE_APPLICATION_CREDENTIALS`

    Your credentials files path

## Running the app locally

```
yarn dev
```

Open http://localhost:8066 in your browser.
