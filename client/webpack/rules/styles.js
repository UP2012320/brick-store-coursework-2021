/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {arrayFilterEmpty} from '../utils/helpers';
import {
  cssLoader,
  cssLoaderItems,
  cssModulesSupportLoaderItems,
  miniCssExtractLoader,
  resolveUrlLoader,
  sassLoaderItems,
} from './useLoaderRuleItems';

/** css **/
export const cssRule = {
  test: /\.css$/,
  use: [miniCssExtractLoader, resolveUrlLoader, cssLoader],
};

/** sass **/
export const sassModulesRule = {
  test: /\.module\.s([ca])ss$/,
  use: arrayFilterEmpty([
    ...cssModulesSupportLoaderItems,
    resolveUrlLoader,
    ...sassLoaderItems,
  ]),
};

export const sassRule = {
  test: /\.s([ca])ss$/,
  exclude: /\.module.scss$/,
  use: arrayFilterEmpty([
    ...cssLoaderItems,
    resolveUrlLoader,
    ...sassLoaderItems,
  ]),
};

export const sassRules = [sassModulesRule, sassRule];
