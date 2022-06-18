/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';

import { TitleBar } from './components/TitleBar';

import './App.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<TitleBar />);
