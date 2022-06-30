import React, { useEffect, useState } from 'react';
import LoginCmp from '../components/LoginCmp';
import RegistrationCmp from '../components/RegistrationCmp';

const Login = () => {
    const [isShowLogin, setIsShowLogin] = useState(false)
    const [isShowReg, setIsShowReg] = useState(false)
    useEffect( () => {
        console.log('Login form showed')
        setIsShowLogin(true)
    },[])
    return (
        <div className='gradient_background'>
            <LoginCmp isShowLogin={isShowLogin} setIsShowLogin={setIsShowLogin} isShowRegistation={isShowReg} setIsShowRegistation={setIsShowReg}/>
            <RegistrationCmp isShowLogin={isShowLogin} setIsShowLogin={setIsShowLogin} isShowRegistation={isShowReg} setIsShowRegistation={setIsShowReg}/>
        </div>
    );
};

export default Login;