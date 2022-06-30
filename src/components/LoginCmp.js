import React, { useContext, useRef } from 'react';
import axios from 'axios'
import { AuthContext, NotyfContext } from '../context';

const LoginCmp = ({isShowLogin = false,isShowRegistation,setIsShowLogin,setIsShowRegistation}) => {
    
    const {username, setUsername} = useContext(AuthContext)
    const notyf = useContext(NotyfContext)
    const email = useRef()
    const password = useRef()

    const onSignInHandler = async (e) => {
        e.preventDefault()
        await axios({
            method: 'post',
            url: 'http://localhost:5000/login',
            data: {
                username:email.current.value,
                pass: password.current.value
            }
        })
            .then(response => {
                if(response.data.status){
                    setUsername(email.current.value)
                    localStorage.setItem('username', email.current.value)
                    notyf.success({
                        message:'successfully logged in',
                        duration: 3000,
                        dismissible:true
                    })
                }
                else{
                    notyf.error({
                        message:'user not exist',
                        duration: 3000,
                        dismissible:true
                    })
                }
            })
    }
    
    return (
        <div className='login_form' style={isShowLogin ? {right: 0} : {right:"-100vw"}}>
            <form className='form_group'>
                <div className="logo"></div>
                <label className="text_label" htmlFor="email">email:</label>
                <input required type="email" name="email" ref={email}/>

                <label className="text_label" htmlFor="password">password:</label>
                <input required type="password"  name="password" ref={password}/>

                <input type="checkbox" name="checkbox"/>
                <label className="checkbox_label" htmlFor="checkbox">Keep me Signed in</label>

                <button className="button" onClick={(e) => onSignInHandler(e)}>Sign in</button>
                <p>Don't have an account? <span className='link_btn' onClick={() => {
                    setIsShowRegistation(!isShowRegistation)
                    setIsShowLogin(!isShowLogin)
                }}>Sign up</span></p>
            </form>
        </div>
    );
};

export default LoginCmp;