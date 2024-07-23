import React, { useState } from 'react';
import Input from './Input';

interface Props extends React.ComponentProps<"input"> {
    displayAfterInput?: React.ReactNode
}

function PasswordInput({displayAfterInput, ...props}: Props) {
    const [passwordIsVisibile, setPasswordIsVisibile] = useState(false);
    return (
        <div className="w-[100%] flex flex-col justify-center items-center">
            <Input type={passwordIsVisibile ? 'text' : 'password'} {...props}></Input>
            {displayAfterInput}
            <label className='text-[75%] flex flex-row justify-center items-center mt-0.5'>
                <input type='checkbox' checked={passwordIsVisibile}
                    onChange={() => setPasswordIsVisibile(prev => !prev)} className='mr-1' />
                <span>Show password</span>
                </label>
        </div>
    );
}

export default PasswordInput;