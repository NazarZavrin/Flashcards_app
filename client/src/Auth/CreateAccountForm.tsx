import React, { ComponentProps, useState } from 'react';
import { useAppDispatch } from '../store';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Error from '../components/Error';
import Button from '../components/Button';
import Validator from '../utils/Validator';
import { createAccount } from './userSlice';

interface Props extends ComponentProps<'section'> {
    onLogin: React.MouseEventHandler<HTMLSpanElement>;
}
export interface IUserData {
    name: string;
    email: string;
    password: string;
}

function CreateAccountForm({ onLogin, ...props }: Props) {
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<IUserData>({
        name: '', email: '', password: ''
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
            console.log('fail');
            return;
        }
        await dispatch(createAccount(userData));
        console.log('success');
    }
    return (
        <section {...props} className={'flex flex-col justify-center items-center ' + props.className}>
            <div className='mt-1'>Enter your name:</div>
            <Input className='mt-1' value={userData.name} onChange={event => setUserData({ ...userData, name: event.target.value })} />
            <Error>{errors.name}</Error>
            <div className='mt-1'>Enter your email:</div>
            <Input className='mt-1' value={userData.email} onChange={event => setUserData({ ...userData, email: event.target.value })} />
            <Error>{errors.email}</Error>
            <div className='mt-1'>Enter your password:</div>
            <PasswordInput className='mt-1' value={userData.password} onChange={event => setUserData({ ...userData, password: event.target.value })}
                displayAfterInput={<Error>{errors.password}</Error>} />
            <Button className='mt-2 w-[100%]' onClick={handleSubmit}>Create account</Button>
            <div className='text-[16px] mt-0.5'>Already have an account? <span onClick={onLogin}
                className='text-blue-700 font-bold underline cursor-pointer whitespace-nowrap'>Log in</span>.</div>
        </section>
    );
}

export default CreateAccountForm;