/* eslint-disable canonical/id-match,canonical/filename-match-regex */
import type {Auth0Client} from '@auth0/auth0-spa-js';
import createAuth0Client from '@auth0/auth0-spa-js';
import {serverBaseUrl} from 'Scripts/helpers';

// eslint-disable-next-line import/no-mutable-exports
export let auth0: Auth0Client;

export const fetchAuth0Config = async () => {
  if (auth0) {
    return;
  }

  let response;

  try {
    response = await fetch(new URL('/api/v1/getAuth0Config', serverBaseUrl).href);
  } catch (error) {
    console.error(error);
    return;
  }

  const config = await response.json();

  // eslint-disable-next-line require-atomic-updates
  auth0 = await createAuth0Client({
    cacheLocation: 'localstorage',
    client_id: config.clientId,
    domain: config.domain,
  });
};

