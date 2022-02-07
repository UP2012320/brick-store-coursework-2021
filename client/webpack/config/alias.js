/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 * @see https://webpack.js.org/configuration/dev-server/
 */
import {join} from 'path';

import {rootDir} from '../utils/env';

export const aliasItems = {
  Styles: join(rootDir, '/src/styles'),
  Types: join(rootDir, '/src/types'),
  Scripts: join(rootDir, '/src/scripts'),
  Assets: join(rootDir, '/src/assets'),
  Tests: join(rootDir, '/src/tests'),
  Hooks: join(rootDir, '/src/hooks')
};
