/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';

import { TitleBar } from './components/TitleBar';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<TitleBar />);
