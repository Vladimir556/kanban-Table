import React, { useContext, useRef, useState } from 'react';
import axios from 'axios'
import { AuthContext, NotyfContext } from '../context';

const AuthForm = () => {
    

    const {setUsername} = useContext(AuthContext)

    const [isSignIn, setIsSignIn] = useState(false)
    const notyf = useContext(NotyfContext)
    const loginEmail = useRef()
    const loginPass = useRef()
    const email = useRef()
    const password = useRef()
    const passwordConfirm = useRef()

    const onSignInHandler = async (e) => {
        e.preventDefault()
        console.log(email.current.value, password.current.value)
        await axios({
            method: 'post',
            url: `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/login`,
            data: {
                username:loginEmail.current.value,
                pass: loginPass.current.value
            }
        })
            .then(response => {
                if(response.data.status){
                    setUsername(loginEmail.current.value)
                    localStorage.setItem('username', loginEmail.current.value)
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
    const onSignUpHandler = async (e) => {
        e.preventDefault()
        if(String(email.current.value).length === 0)
        {
            notyf.error({
                message:'Введите email',
                duration: 3000,
                dismissible:true
            })
            return
        }
        if(password.current.value !== passwordConfirm.current.value){
            notyf.error({
                message:'пароли не совпадают',
                duration: 3000,
                dismissible:true
            })
            return
        }
        await axios({
            method: 'post',
            url: `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/registr`,
            data: {
                username:email.current.value,
                pass: password.current.value
            }
        })
            .then(response => {
                if(response.data.status){
                    notyf.success({
                        message:'user created',
                        duration: 3000,
                        dismissible:true
                    })
                    setUsername(email.current.value)
                    localStorage.setItem('username', email.current.value)
                }
                else{
                    notyf.error({
                        message:'user already exist',
                        duration: 3000,
                        dismissible:true
                    })
                }
            })
        
    }
    
    return (
        <>
            
            <div className='login_form' style={!isSignIn ? {right: 0} : {right:"-100vw"}}>
                <form className='form_group'>
                    <div className="logo"></div>
                    <label className="text_label" htmlFor="email">email:</label>
                    <input required type="email" name="email" ref={loginEmail} autoComplete="on"/>

                    <label className="text_label" htmlFor="password">password:</label>
                    <input required type="password"  name="password" ref={loginPass} autoComplete="on"/>

                    <input type="checkbox" name="checkbox"/>
                    <label className="checkbox_label" htmlFor="checkbox">Keep me Signed in</label>

                    <button className="button" onClick={(e) => onSignInHandler(e)}>Sign in</button>
                    <p>Don't have an account? <span className='link_btn' onClick={() => {
                        setIsSignIn(!isSignIn)
                    }}>Sign up</span></p>
                </form>
            </div>
            <div className='login_form' style={isSignIn ? {right: 0} : {right:"-100vw"}}>
                <form className='form_group'>
                    <div className="logo"></div>
                    <label className="text_label" htmlFor="email">email:</label>
                    <input required type="email" name="email" ref={email} autoComplete="off"/>

                    <label className="text_label" htmlFor="password">password:</label>
                    <input required type="password" name="password" ref={password} autoComplete="off"/>

                    <label className="text_label" htmlFor="password">confirm password:</label>
                    <input required type="password" name="password" ref={passwordConfirm} autoComplete="off"/>

                    <input type="checkbox" name="checkbox"/>
                    <label className="checkbox_label" htmlFor="checkbox">Keep me Signed in</label>

                    <button className="button" onClick={(e) => onSignUpHandler(e)}>Sign up</button>
                    <p>Already have an account? <span className='link_btn' onClick={() => {
                        setIsSignIn(!isSignIn)
                    }}>Sign in</span></p>
                </form>
            </div>
        </>
    );
};

export default AuthForm;