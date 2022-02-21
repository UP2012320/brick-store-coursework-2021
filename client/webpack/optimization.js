/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

export default {
  runtimeChunk: {
    name: 'runtime',
  }, splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/, name: 'vendor', chunks: 'initial',
      },
    },
  }, minimizer: [new ImageMinimizerPlugin({
                                            minimizer: {
                                              implementation: ImageMinimizerPlugin.imageminMinify, options: {
                                                plugins: [['gifsicle'], ['mozjpeg'], ['pngquant']]
                                              }
                                            }
                                          })]
};
