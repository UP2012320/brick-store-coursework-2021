import {
  resolve,
} from 'path';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import alias from '@rollup/plugin-alias';
import {
  defineConfig,
} from 'vite';
import sassDts from 'vite-plugin-sass-dts';

const projectRootDirectory = resolve(__dirname);

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles" as common;',
        importer (...args) {
          if (args[0] !== '@/styles') {
            return;
          }

          // eslint-disable-next-line consistent-return
          return {
            file: `${resolve(projectRootDirectory, 'src/styles')}`,
          };
        },
      },
    },
  },
  define: {
    global: {},
  },
  plugins: [
    alias({
      entries: [
        {
          find: 'Scripts',
          replacement: resolve(projectRootDirectory, 'src/scripts'),
        },
        {
          find: 'Hooks',
          replacement: resolve(projectRootDirectory, 'src/scripts/hooks'),
        },
        {
          find: 'Assets',
          replacement: resolve(projectRootDirectory, 'src/assets'),
        },
        {
          find: 'Styles',
          replacement: resolve(projectRootDirectory, 'src/styles'),
        },
        {
          find: 'Types',
          replacement: resolve(projectRootDirectory, 'src/types'),
        },
      ],
    }),
    sassDts({
      allGenerate: true,
      global: {
        generate: true,
        outFile: resolve(projectRootDirectory, 'src/style.d.ts'),
      },
    }),
    eslintPlugin(),
  ],
});
