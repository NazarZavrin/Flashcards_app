import React, { ComponentProps } from 'react';

function Tabs({ children, ...props }: ComponentProps<"div">) {
    return (
        <div {...props} className={"flex flex-row rounded bg-gray-300 p-1 border border-solid border-[gray] " + props.className}>
            {children}
        </div>
    );
}

export default Tabs;