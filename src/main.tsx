import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// patch for React 19 compatibility
// if you are using React 18, you can remove this line
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router';
import { AppRoute } from './routes/app.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={AppRoute} />
  </StrictMode>,
)
