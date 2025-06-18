import React, { ComponentProps, useState } from 'react';
import { useAppDispatch } from '../store';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Error from '../components/Error';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { IUserData, createAccount } from './userSlice';
import { showMessage } from '../App/appSlice';

interface Props extends ComponentProps<'section'> {
    onLogin: React.MouseEventHandler<HTMLSpanElement>;
}

function CreateAccountForm({ onLogin, ...props }: Props) {
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<IUserData>({
        name: 'Ann', email: 'ann@gmail.com', password: 'annp'
    })
    const [errors, setErrors] = useState({
        name: '', email: '', password: ''
    })
    async function handleSubmit() {
        errors.name = Validator.validateName(userData.name);
        errors.email = Validator.validateEmail(userData.email);
        errors.password = Validator.validatePassword(userData.password);
        // console.log(errors);
        setErrors({ ...errors });
        if (Object.values(errors).some(value => value.length > 0)) {
            // dispatch(showMessage({ type: 'warning', text: 'Failed to create account' }));
            return;
        }
        const dispatchResult = await dispatch(createAccount(userData));
        if (createAccount.rejected.match(dispatchResult)) { // if createAccount action was rejected
            dispatch(showMessage({ type: "error", text: 'Application error' }));
            console.error('createAccount.rejected');
            console.error(dispatchResult.error);
        } else if (dispatchResult.payload.ok === false) {
            // console.log(dispatchResult.payload);
            const errorMessage = dispatchResult.payload.result.message;
            if (errorMessage.includes('email already exists')) {
                dispatch(showMessage({ type: "error", text: errorMessage }));
            } else {
                dispatch(showMessage({ type: "error", text: 'Server error' }));
                console.error('serverResponse.ok is false');
                console.error(errorMessage);
            }
        } else {
            dispatch(showMessage({ text: 'Account created' }));
        }
    }
    return (
        <section {...props} className={'flex flex-col justify-center items-center ' + props.className}>
            <div className='mt-1'>Enter your name:</div>
            <Input className='mt-1' value={userData.name} name='name' autoComplete='name' onChange={event => setUserData({ ...userData, name: event.target.value })} />
            <Error>{errors.name}</Error>
            <div className='mt-1'>Enter your email:</div>
            <Input className='mt-1' value={userData.email} name='email' autoComplete='email' onChange={event => setUserData({ ...userData, email: event.target.value })} />
            <Error>{errors.email}</Error>
            <div className='mt-1'>Enter your password:</div>
            <PasswordInput className='mt-1' value={userData.password} name='password' onChange={event => setUserData({ ...userData, password: event.target.value })}
                displayAfterInput={<Error>{errors.password}</Error>} />
            <Button className='mt-2 w-[100%]' onClick={handleSubmit}>Create account</Button>
            <div className='text-[16px] mt-0.5'>Already have an account? <span onClick={onLogin}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Log in</span>.</div>
        </section>
    );
}

export default CreateAccountForm;