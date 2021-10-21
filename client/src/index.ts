import 'Styles/reset.scss';

import {Main} from 'Scripts/components/main';
import {Root} from 'Scripts/framework/component';

const root = new Root();
root.appendChild(new Main());
root.build();
