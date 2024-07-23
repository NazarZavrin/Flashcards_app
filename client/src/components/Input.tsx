import React, { ComponentProps } from 'react';

function Input(props: ComponentProps<"input">) {
    return (
        <input {...props} className={'text-[90%] inline-block w-[100%] border border-solid border-gray-500 rounded-[5px] px-1 py-[2px] focus:border-blue-600 focus:shadow-[inset_0_0_0_1px_blue] focus:shadow-blue-600 ' + props.className}></input>
    );
}

export default Input;