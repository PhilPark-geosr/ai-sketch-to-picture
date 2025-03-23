import { createRoot } from 'react-dom/client'
import './index.css'
import Router from '@/routes/index.tsx'
import { Provider } from 'react-redux'
import store from '@/store/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router />
    </Provider>
  </QueryClientProvider>
)
