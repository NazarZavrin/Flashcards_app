import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<"div"> {
    active: boolean;
}

function Tab({ children, active: tabIsActive, ...props }: Props) {
    const activeTabStyle = tabIsActive ? 'text-blue-500 bg-white border border-solid border-gray-500 ' : 'text-gray-500 ';
    return (
        <div {...props} className={"py-1 px-3 m-0 rounded whitespace-nowrap " + activeTabStyle + props.className}>
            {children}
        </div>
    );
}

export default Tab;