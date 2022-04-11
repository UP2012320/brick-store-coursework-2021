/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import * as plugins from './plugins';

export default {
    plugins: [plugins.cleanWebpackPlugin, plugins.miniCssExtractPlugin],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
