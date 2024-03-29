/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {join} from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {sassResourceItems} from '../config';
import {isProd, webpackDir} from '../utils/env';

export const cssLoader = {
  loader: 'css-loader',
  options: {modules: true},
};

/**
 * Sass loader with sass-resources-loader
 */
export const sassLoaderItems = [
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      // Prefer `dart-sassRules`
      implementation: require('sass'),
    },
  },
  sassResourceItems.length
    ? {
        loader: 'sass-resources-loader',
        options: {
          resources: sassResourceItems,
        },
      }
    : null,
];

/***
 * Using MiniCssExtractPlugin in production or style-loader in development
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/#root
 * @see https://webpack.js.org/loaders/style-loader/#root
 */
export const miniCssExtractLoader = isProd
  ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    }
  : {
      loader: 'style-loader',
      options: {
        esModule: false,
      },
    };

export const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: join(webpackDir, './config/postcss.js'),
    },
    sourceMap: true,
  },
};

/**
 * Using to convert CSS modules from css-loader to TypeScript typings
 * @see https://github.com/TeamSupercell/typings-for-css-modules-loader
 */
export const typingsCssModulesLoader = {
  loader: '@teamsupercell/typings-for-css-modules-loader',
  options: {
    banner:
      '// autogenerated by typings-for-css-modules-loader. \n// Please do not change this file!',
    formatter: 'prettier',
  },
};

/**
 * @see https://webpack.js.org/loaders/sass-loader/#problems-with-url
 */
export const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: {
    sourceMap: true,
  },
};

export const cssModulesSupportLoaderItems = [
  miniCssExtractLoader,
  typingsCssModulesLoader,
  {
    ...cssLoader,
    options: {
      esModule: false,
      modules: {
        exportLocalsConvention: 'camelCaseOnly',
        localIdentName: '[local]__[contenthash:base64:5]',
      },
    },
  },
];

export const cssLoaderItems = [miniCssExtractLoader, cssLoader];
