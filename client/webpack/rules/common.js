/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

export const javascriptRule = {
  test: /\.tsx?$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'esbuild-loader',
  options: {
    loader: 'ts',
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
