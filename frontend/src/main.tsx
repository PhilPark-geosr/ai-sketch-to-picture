import { createRoot } from 'react-dom/client'
import './index.css'
import Router from '@/routes/index.tsx'
import { Provider } from 'react-redux'
import store from '@/store/index.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router />
  </Provider>
)
