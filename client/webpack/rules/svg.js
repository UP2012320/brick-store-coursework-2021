/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

/**
 * Using file-loader for handling svg files
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const svgRule = {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    issuer: {not: [/\.[jt]sx$/]},
    type: 'asset/source',
};

export const svgRules = [svgRule];
