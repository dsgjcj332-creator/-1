import { createRoot } from 'react-dom/client';
import { OperationsApp } from './operations/OperationsApp';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<OperationsApp onBackToLanding={() => {}} />);