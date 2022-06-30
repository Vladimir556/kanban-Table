import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { AuthContext, NotyfContext } from './context';
import { Notyf } from 'notyf';
// pages
import KanBan from './pages/KanBan';
import KanbanManager from './pages/KanbanManager';
import Login from './pages/Login';
import Page404 from './pages/Page404';

function App() {
  
  const [username, setUsername] = useState(localStorage['username'])
  const notyf = new Notyf()
  return (
    <NotyfContext.Provider value={
      notyf
    }>
      <AuthContext.Provider value={{
      username,
      setUsername
    }}>
      <BrowserRouter>
        <div className='wrapper'>
        <Navbar/>
        <Routes>
          {
            username ? 
            <>
            <Route path="kanban" element={<KanbanManager/>}/>
            <Route path="kanban/:id" element={<KanBan/>}/>
            <Route path="*" element={<Page404/>}/>
            </>
            :
            <>
            <Route path="login" element={<Login/>}/>
            <Route path="*" element={<Navigate to='login' replace/>}/>
            </>
          }
            
        </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
    </NotyfContext.Provider>
  );
}

export default App;
