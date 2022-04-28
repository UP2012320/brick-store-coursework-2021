/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import path from 'path';

import {aliasItems, devServerUrl} from './config';
import entry from './entry';
import optimization from './optimization';
import * as plugins from './plugins';
import * as rules from './rules';
import {isDevServer, isProd} from './utils/env';
import {arrayFilterEmpty} from './utils/helpers';

const publicPath = isDevServer ? devServerUrl : process.env.IS_VERCEL ? './' : './public/';

export default {
  context: __dirname,
  target: isDevServer ? 'web' : ['web', 'es6'],
  mode: isProd ? 'production' : 'development',
  entry,
  output: {
    path: path.join(__dirname, '../../dist/public'),
    publicPath: publicPath,
    filename: isDevServer ? '[name].[fullhash].js' : '[name].[contenthash].js',
  },
  module: {
    rules: arrayFilterEmpty([rules.javascriptRule, rules.htmlRule, rules.imagesRule, rules.fontsRule, rules.bootstrapRule, rules.cssRule, ...rules.sassRules, ...rules.svgRules,]),
  },
  plugins: arrayFilterEmpty([plugins.htmlWebpackPlugin, plugins.providePlugin, plugins.definePlugin,]),
  resolve: {
    alias: aliasItems, extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  optimization,
};
