import React, { ComponentProps, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import InputError from '../components/InputError';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { showMessage } from '../App/messageSlice';
import ButtonLoader from '../components/ButtonLoader';
import { IUserData, createAccount, setCreateAccountFormInputs } from './createAccountFormSlice';
import { setUserData } from './userSlice';

interface Props extends ComponentProps<'form'> {
    onLogin: React.MouseEventHandler<HTMLSpanElement>;
}

function CreateAccountForm({ onLogin, ...props }: Props) {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(state => state.createAccountForm.isLoading);
    const loader = <ButtonLoader />;
    const createAccountFormInputs = useAppSelector(state => state.createAccountForm.inputs);
    const [errors, setErrors] = useState<IUserData>({
        name: '', email: '', password: ''
    })
    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault(); // prevent form submission
        errors.name = Validator.validateName(createAccountFormInputs.name);
        errors.email = Validator.validateEmail(createAccountFormInputs.email);
        errors.password = Validator.validatePassword(createAccountFormInputs.password);
        setErrors({ ...errors });
        if (Object.values(errors).some(value => value.length > 0)) {
            return;
        }
        try {
            const response = await dispatch(createAccount(createAccountFormInputs)).unwrap();
            const result = response.result;
            if (response.ok) {
                dispatch(setUserData(result.userData));
                localStorage.setItem('accessToken', result.accessToken);
                dispatch(showMessage({ text: 'Account created' }));
            } else {
                const errorMessage = result.message;
                if (errorMessage.includes('email already exists')) {
                    dispatch(showMessage({ type: "error", text: errorMessage }));
                } else {
                    dispatch(showMessage({ type: "error", text: 'Server error' }));
                    console.error('serverResponse.ok is false');
                    console.error(errorMessage);
                }
            }
        } catch (error: unknown) {
            dispatch(showMessage({ type: "error", text: 'Application error' }));
            console.error('createAccount rejected');
            console.error(error);
        }
    }
    return (
        <form {...props} className={'flex flex-col justify-center items-center ' + props.className}>
            <div className='mt-1'>Enter your name:</div>
            <Input className='mt-1' value={createAccountFormInputs.name} name='name' autoComplete='name' onChange={event => dispatch(setCreateAccountFormInputs({ ...createAccountFormInputs, name: event.target.value }))} />
            <InputError>{errors.name}</InputError>
            <div className='mt-1'>Enter your email:</div>
            <Input className='mt-1' value={createAccountFormInputs.email} name='email' autoComplete='email' onChange={event => dispatch(setCreateAccountFormInputs({ ...createAccountFormInputs, email: event.target.value }))} />
            <InputError>{errors.email}</InputError>
            <div className='mt-1'>Enter your password:</div>
            <PasswordInput className='mt-1' value={createAccountFormInputs.password} name='password' onChange={event => dispatch(setCreateAccountFormInputs({ ...createAccountFormInputs, password: event.target.value }))}
                displayAfterInput={<InputError>{errors.password}</InputError>} />
            <Button className='mt-1 w-[100%]' onClick={handleSubmit}>{!isLoading ? "Create account" : loader}</Button>
            <div className='text-[0.75em] mt-0.5'>Already have an account? <span onClick={onLogin}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Log in</span>.</div>
        </form>
    );
}

export default CreateAccountForm;