import React, { ComponentProps, useState } from 'react';
import { useAppDispatch } from '../store';
import { IUserData } from './CreateAccountForm';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Error from '../components/Error';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { showMessage } from '../App/appSlice'

interface Props extends ComponentProps<'section'> {
    onCreateAccount: React.MouseEventHandler<HTMLSpanElement>;
}
type UserDataForLogin = Pick<IUserData, 'email' | 'password'>

function LoginForm({ onCreateAccount, ...props }: Props) {
    const dispatch = useAppDispatch();
    const [userDataForLogin, setUserDataForLogin] = useState<UserDataForLogin>({
        email: '', password: ''
    })
    const [errors, setErrors] = useState({
        email: '', password: ''
    })
    async function handleSubmit() {
        // dispatch(setMessage(userDataForLogin.password))
        let message = userDataForLogin.password || 'Email is not correct';
        dispatch(showMessage({ text: message }));
        errors.email = Validator.validateEmail(userDataForLogin.email);
        errors.password = userDataForLogin.password.length <= 0 ? 'Enter password.' : '';
        console.log(errors);
        setErrors({ ...errors });
        if (Object.values(errors).some(value => value.length > 0)) {
            console.log('fail');
            return;
        }
        console.log('success');
    }
    return (
        <section {...props} className={'flex flex-col justify-center items-center ' + props.className}>
            <div className='mt-1'>Email:</div>
            <Input className='mt-1' value={userDataForLogin.email} name='email' autoComplete='email' onChange={event => setUserDataForLogin({ ...userDataForLogin, email: event.target.value })} />
            <Error>{errors.email}</Error>
            <div className='mt-1'>Password:</div>
            <PasswordInput className='mt-1' value={userDataForLogin.password} name='password' onChange={event => setUserDataForLogin({ ...userDataForLogin, password: event.target.value })}
                displayAfterInput={<Error>{errors.password}</Error>} />
            <Button className='bg-blue-500 mt-2 w-[100%]' onClick={handleSubmit}>Login</Button>
            <div className='text-[16px] mt-0.5'>Don't have an account? <span onClick={onCreateAccount}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Create it</span>.</div>
        </section>
    );
}

export default LoginForm;