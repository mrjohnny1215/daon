import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
const Admin = lazy(() => import('./admin/Admin.jsx'))
const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <Suspense fallback={<div style={{ padding: 40 }}>관리자 페이지 연결 중…</div>}><Admin /></Suspense> : <App />}
  </React.StrictMode>,
)
