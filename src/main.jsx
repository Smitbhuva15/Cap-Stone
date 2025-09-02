import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './store/store'
import { Provider } from 'react-redux'
import './App.css'
import Thirdwebprovider from './provider/Thirdwebprovider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Thirdwebprovider>
    <Provider store={store}>
    <App />
    </Provider>
   </Thirdwebprovider>
  </StrictMode>,

)
