import React, { ComponentProps } from 'react';

function InputError({ children, ...props }: ComponentProps<"p">) {
    return (
        <b {...props} className={'text-red-600 text-[75%] whitespace-wrap ' + props.className}>{children}</b>
    );
}

export default InputError;