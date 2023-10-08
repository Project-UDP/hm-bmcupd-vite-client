import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider as StoreProvider } from 'react-redux'
import { store } from './store/store.ts'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

dayjs.locale('ru')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={ruRu}>
      <StoreProvider store={store}>
        <App />
        <ToastContainer />
      </StoreProvider>
    </ConfigProvider>
  </React.StrictMode>
)
