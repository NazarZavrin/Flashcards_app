import React, { ComponentProps } from 'react';

function Button({children, ...props}: ComponentProps<"button">) {
    return (
        <button {...props} className={'bg-[limegreen] text-white p-1 rounded-[5px] inline-flex flex-row justify-center items-center whitespace-nowrap ' + props.className}>{children}</button>
    );
}

export default Button;