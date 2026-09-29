// import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './provider/AuthProvider';
import { CartProvider } from './provider/CartProvider';

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <AppRoutes/>
          </CartProvider>
        </AuthProvider>      
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
