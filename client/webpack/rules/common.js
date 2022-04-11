/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

import path from 'path';
import {rootDir} from '../utils/env';

export const javascriptRule = {
  test: /\.tsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "swc-loader"
  },
};

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
export const htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: 'html-loader',
  },
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const imagesRule = {
  test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  type: 'asset',
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const fontsRule = {
  test: /\.(woff(2)?|eot|ttf|otf|)$/,
  type: 'asset/inline',
};

export const bootstrapRule = {
  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  include: path.resolve(rootDir, './node_modules/bootstrap-icons/font/fonts'),
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'webfonts',
      publicPath: '../webfonts',
    },
  }
}
