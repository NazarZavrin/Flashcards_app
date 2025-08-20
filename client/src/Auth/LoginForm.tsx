import React, { ComponentProps, useState } from 'react';
import { useAppDispatch } from '../store';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import InputError from '../components/InputError';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { showMessage } from '../App/messageSlice';
import ButtonLoader from '../components/ButtonLoader';
import { logIn, setIsAuthenticated, setUserData } from './userSlice';
import { UserDataForLogin } from './AuthForm';

interface Props extends ComponentProps<'form'> {
    loginFormInputs: UserDataForLogin;
    setLoginFormInputs: React.Dispatch<React.SetStateAction<UserDataForLogin>>;
    onCreateAccount: React.MouseEventHandler<HTMLSpanElement>;
}

function LoginForm({ loginFormInputs, setLoginFormInputs, onCreateAccount, ...props }: Props) {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const loader = <ButtonLoader className='max-h-[1em]' />;
    const [errors, setErrors] = useState<UserDataForLogin>({
        email: '', password: ''
    })
    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault(); // prevent form submission
        errors.email = Validator.validateEmail(loginFormInputs.email);
        errors.password = loginFormInputs.password.length <= 0 ? 'Enter password' : '';
        setErrors({ ...errors });
        if (Object.values(errors).some(value => value.length > 0)) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await dispatch(logIn(loginFormInputs)).unwrap();
            const result = response.result;
            if (response.ok) {
                dispatch(showMessage({ text: 'Login successful' }));
                dispatch(setIsAuthenticated(true));
                dispatch(setUserData(result.userData));
                localStorage.setItem('accessToken', result.accessToken);
            } else {
                const errorMessage = result.message;
                if (errorMessage.includes('does not exist')
                    || errorMessage.includes('Wrong password')) {
                    dispatch(showMessage({ type: "error", text: errorMessage }));
                } else {
                    dispatch(showMessage({ type: "error", text: 'Server error' }));
                    console.error('serverResponse.ok is false');
                    console.error(errorMessage);
                }
            }
            setIsLoading(false);
        } catch (error: unknown) {
            setIsLoading(false);
            dispatch(showMessage({ type: "error", text: 'Application error' }));
            console.error('logIn rejected');
            console.error(error);
        }
    }
    return (
        <form {...props} className={'flex flex-col justify-center items-center ' + (props.className || '')}>
            <div className='mt-1'>Email:</div>
            <Input className='mt-1' value={loginFormInputs.email} name='email' autoComplete='email' onChange={event => setLoginFormInputs({ ...loginFormInputs, email: event.target.value })} />
            <InputError>{errors.email}</InputError>
            <div className='mt-1'>Password:</div>
            <PasswordInput className='mt-1' value={loginFormInputs.password} name='password' onChange={event => setLoginFormInputs({ ...loginFormInputs, password: event.target.value })}
                displayAfterInput={<InputError>{errors.password}</InputError>} />
            <Button className='bg-blue-500 mt-1 w-[100%]' onClick={handleSubmit}>{!isLoading ? "Login" : loader}</Button>
            <div className='text-[0.75em] mt-0.5'>Don't have an account? <span onClick={onCreateAccount}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Create it</span>.</div>
        </form>
    );
}

export default LoginForm;