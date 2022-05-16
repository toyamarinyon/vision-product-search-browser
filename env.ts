import { str, envsafe } from 'envsafe'

export const env = envsafe({
  PROJECT: str(),
  LOCATION: str({
    choices: ['us-west1', 'us-east1', 'asia-east1', 'europe-west1'],
  }),
  GOOGLE_APPLICATION_CREDENTIALS: str(),
})
