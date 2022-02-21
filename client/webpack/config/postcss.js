/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 * @see https://github.com/postcss/postcss
 */
import {arrayFilterEmpty} from '../utils/helpers';

module.exports = () => {
  const plugins = arrayFilterEmpty([
    'postcss-preset-env',
    'autoprefixer',
  ]);
  return {
    plugins,
  };
};
