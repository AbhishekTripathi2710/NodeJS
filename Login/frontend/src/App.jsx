import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/LoginForm/LoginForm';
import PrivateRoute from './utils/PrivateRoute';
import Home from './components/Home/Home';
import AlertComponent from './components/AlertComponents/AlertComponent';

function App() {
  const [title,updateTitle] = useState(null);
  const [errorMessage,updateErrorMessage] = useState(null);

  return (
    <BrowserRouter>
    <div className='App'>
        <Header title={title}></Header>
        <div className='container min-vh-100 d-flex justify-content-center align-items-start align-items-lg-center py-4'>
          <Routes>
            <Route path='/' element={<RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}></RegistrationForm>}></Route>
            <Route path="/register" element={<RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />} />
            <Route path="/login" element={<LoginForm showError={updateErrorMessage} updateTitle={updateTitle} />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
    </div>
    </BrowserRouter>
  )
}

export default App
