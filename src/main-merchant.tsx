import { createRoot } from 'react-dom/client';
import MerchantPortalApp from './merchant/MerchantPortalApp';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<MerchantPortalApp onBackToLanding={() => {}} />);