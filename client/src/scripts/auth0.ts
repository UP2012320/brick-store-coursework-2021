/* eslint-disable canonical/id-match,canonical/filename-match-regex */
import createAuth0Client, {type Auth0Client, type User} from '@auth0/auth0-spa-js';
import {SERVER_BASE} from 'Scripts/helpers';

// eslint-disable-next-line import/no-mutable-exports
export let auth0: Auth0Client;

export const fetchAuth0Config = async () => {
  if (auth0) {
    return;
  }

  let response;

  try {
    response = await fetch(new URL('/api/v1/getAuth0Config', SERVER_BASE).href);
  } catch (error) {
    console.error(error);
    return;
  }

  const config = await response.json();

  // eslint-disable-next-line require-atomic-updates
  auth0 = await createAuth0Client({
    audience: config.audience,
    cacheLocation: 'localstorage',
    client_id: config.clientId,
    domain: config.domain,
    useRefreshTokens: true,
  });
};

export const runIfAuthenticated = async (callback: (userInfo: User) => Promise<void> | void) => {
  if (await auth0.isAuthenticated()) {
    const userInfo = await auth0.getUser();

    if (!userInfo) {
      console.error('Failed to retrieve user info');
      return;
    }

    await callback(userInfo);
  }
};

export const getAuthorizationHeader = async (): Promise<HeadersInit | undefined> => {
  let result;

  await runIfAuthenticated(async () => {
    try {
      console.debug('getting token');
      const token = await auth0.getTokenSilently();

      if (!token) {
        return;
      }

      result = {
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.error(error);
    }
  });

  return result;
};
