import {serverBaseUrl} from 'Scripts/helpers';
import type {GetBrickColoursResponse, GetBrickTypesResponse} from 'api-types';

export const fetchColours = async () => {
  const url = new URL('/api/v1/getBrickColours', serverBaseUrl);

  let response;

  try {
    response = await fetch(url.href);
  } catch (error) {
    console.debug(error);
    return [];
  }

  if (!response.ok) {
    console.debug(response);
    return [];
  }

  const colours = await response.json();

  return colours as GetBrickColoursResponse[];
};

export const fetchTypes = async () => {
  const url = new URL('/api/v1/getBrickTypes', serverBaseUrl);

  let response;

  try {
    response = await fetch(url.href);
  } catch (error) {
    console.debug(error);
    return [];
  }

  if (!response.ok) {
    console.debug(response);
    return [];
  }

  const types = await response.json();

  return types as GetBrickTypesResponse[];
};
