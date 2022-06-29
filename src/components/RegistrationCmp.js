import React, { useContext, useRef } from 'react';
import axios from 'axios'
import { AuthContext } from '../context';

const RegistrationCmp = ({isShowLogin = false,isShowRegistation = false,setIsShowLogin,setIsShowRegistation}) => {
    
    const {username, setUsername} = useContext(AuthContext)

    const email = useRef()
    const password = useRef()
    const passwordConfirm = useRef()

    const onSignUpHandler = async (e) => {
        e.preventDefault()
        if(String(email.current.value).length == 0)
        {
            alert('Введите email')
            return
        }
        if(password.current.value !== passwordConfirm.current.value){
            alert('пароли не совпадают')
            return
        }
        await axios({
            method: 'post',
            url: 'http://localhost:5000/registr',
            data: {
                username:email.current.value,
                pass: password.current.value
            }
        })
            .then(response => {
                if(response.data.status){
                    alert('user created')
                    setUsername(email.current.value)
                    localStorage.setItem('username', email.current.value)

                }
                else{
                    alert('user exist')
                }
            })
        
    }

    return (
        <div className='login_form' style={isShowRegistation ? {right: 0} : {right:"-100vw"}}>
            <form className='form_group'>
                <div className="logo"></div>
                <label className="text_label" htmlFor="email">email:</label>
                <input required type="email" name="email" ref={email}/>

                <label className="text_label" htmlFor="password">password:</label>
                <input required type="password" name="password" ref={password}/>

                <label className="text_label" htmlFor="password">confirm password:</label>
                <input required type="password" name="password" ref={passwordConfirm}/>

                <input type="checkbox" name="checkbox"/>
                <label className="checkbox_label" htmlFor="checkbox">Keep me Signed in</label>

                <button className="button" onClick={(e) => onSignUpHandler(e)}>Sign up</button>
                <p>Already have an account? <span className='link_btn' onClick={() => {
                    setIsShowRegistation(!isShowRegistation)
                    setIsShowLogin(!isShowLogin)
                }}>Sign in</span></p>
            </form>
        </div>
    );
};

export default RegistrationCmp;