// import { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './provider/AuthProvider';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <h1>Hello Vite + React!</h1>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <AppRoutes/>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
