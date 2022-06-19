/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';

import { TitleBar } from './TitleBar';

import './TitleBar.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<TitleBar />);
