import { createRoot } from 'react-dom/client'
import './index.css'
import Router from '@/routes/index.tsx'
import { Provider } from 'react-redux'
import store from '@/store/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router />
      <ReactQueryDevtools />
    </Provider>
  </QueryClientProvider>
)
