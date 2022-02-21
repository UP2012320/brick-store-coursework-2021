/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import * as plugins from './plugins';
import {ESBuildMinifyPlugin} from 'esbuild-loader';

export default {
    optimization: {
      minimize: true,
      minimizer: [new ESBuildMinifyPlugin()],
    },
    plugins: [plugins.cleanWebpackPlugin, plugins.miniCssExtractPlugin],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
