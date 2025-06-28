import React, { ComponentProps, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logIn, UserDataForLogin } from './userSlice';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Error from '../components/Error';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { showMessage } from '../App/appSlice';
import ButtonLoader from '../components/ButtonLoader';

interface Props extends ComponentProps<'form'> {
    onCreateAccount: React.MouseEventHandler<HTMLSpanElement>;
}

function LoginForm({ onCreateAccount, ...props }: Props) {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(state => state.user.isLoading);
    // console.log(isLoading);
    const [userDataForLogin, setUserDataForLogin] = useState<UserDataForLogin>({
        email: '', password: ''
    })
    const [errors, setErrors] = useState({
        email: '', password: ''
    })
    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault(); // prevent form submission
        errors.email = Validator.validateEmail(userDataForLogin.email);
        errors.password = userDataForLogin.password.length <= 0 ? 'Enter password.' : '';
        setErrors({ ...errors });
        if (Object.values(errors).some(value => value.length > 0)) {
            // dispatch(showMessage({ type: 'warning', text: 'Failed to log in' }));
            return;
        }
        const dispatchResult = await dispatch(logIn(userDataForLogin));
        if (logIn.rejected.match(dispatchResult)) {
            dispatch(showMessage({ type: "error", text: 'Application error' }));
            console.error('logIn.rejected');
            console.error(dispatchResult.error);
        } else if (dispatchResult.payload.ok === false) {
            const errorMessage = dispatchResult.payload.result.message;
            if (errorMessage.includes('does not exist')
                || errorMessage.includes('Wrong password')) {
                dispatch(showMessage({ type: "error", text: errorMessage }));
            } else {
                dispatch(showMessage({ type: "error", text: 'Server error' }));
                console.error('serverResponse.ok is false');
                console.error(errorMessage);
            }
        } else {
            dispatch(showMessage({ text: 'Login successful' }));
        }
    }
    return (
        <form {...props} className={'flex flex-col justify-center items-center ' + props.className}>
            <div className='mt-1'>Email:</div>
            <Input className='mt-1' value={userDataForLogin.email} name='email' autoComplete='email' onChange={event => setUserDataForLogin({ ...userDataForLogin, email: event.target.value })} />
            <Error>{errors.email}</Error>
            <div className='mt-1'>Password:</div>
            <PasswordInput className='mt-1' value={userDataForLogin.password} name='password' onChange={event => setUserDataForLogin({ ...userDataForLogin, password: event.target.value })}
                displayAfterInput={<Error>{errors.password}</Error>} />
            <Button className='bg-blue-500 mt-2 w-[100%]' onClick={handleSubmit}>{!isLoading ? "Login" : <ButtonLoader />}</Button>
            <div className='text-[16px] mt-0.5'>Don't have an account? <span onClick={onCreateAccount}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Create it</span>.</div>
        </form>
    );
}

export default LoginForm;