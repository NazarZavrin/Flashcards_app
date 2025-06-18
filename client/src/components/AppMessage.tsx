import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { defaultDisplayDuration, hideMessage, MessageInfo, showMessage } from '../App/appSlice';
import { ReactComponent as Success } from '../assets/success-circle.svg';
import { ReactComponent as Info } from '../assets/info-circle.svg';
import { ReactComponent as Warning } from '../assets/warning-triangle.svg';
import { ReactComponent as Error } from '../assets/error-circle-with-a-cross.svg';
import { ReactComponent as CloseCircle } from '../assets/close-circle.svg';

interface Props extends React.ComponentProps<'div'>, Omit<MessageInfo, 'text'> {
    children: MessageInfo['text']
}

const icons: Record<NonNullable<MessageInfo['type']>, React.ReactNode> = {
    success: <Success fill='limegreen' className='h-[1em] mr-1' />,
    info: <Info fill='dodgerblue' className='h-[0.95em] mr-1' />,
    warning: <Warning fill='orange' className='h-[0.9em] mr-1' />,
    error: <Error fill='red' className='h-[1em] mr-1' />,
}

function AppMessage(props: Props) {
    const dispatch = useAppDispatch();
    const mustBeDisplayed = useAppSelector(state => state.app.mustBeDisplayed);
    const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let generalStyles = 'fixed left-0 bottom-0 transition-all duration-[2s] p-1.5 mb-1 rounded-[0.5em] border-2 border-solid border-gray-600 bg-white inline-flex flex-row items-center items-end ';
    generalStyles += !mustBeDisplayed ? '-translate-x-full ease-in' : 'ml-1 ease-out';
    function scheduleHiding() {
        if (mustBeDisplayed) {
            /* if the transition ended while the message is marked as the one that 
            must be displayed, then we have to schedule its hiding */
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }
            // console.log(new Date().toLocaleTimeString());
            timerIdRef.current = setTimeout(() => {
                dispatch(hideMessage());
                // console.log(new Date().toLocaleTimeString());
            }, props.displayDuration ?? defaultDisplayDuration);
        }
    }
    return (
        <div className={generalStyles}
            onTransitionEnd={event => event.propertyName === 'transform' ? scheduleHiding() : 0}
            onClick={() => mustBeDisplayed ? scheduleHiding() : dispatch(showMessage({...props, text: props.children}))}>
            {icons[props.type ?? 'success']}
            <span className='leading-none'>{props.children}</span>
            <CloseCircle className='h-[1em] ml-1' fill='slategray' 
                onClick={() => dispatch(hideMessage())} />
        </div>
    );
}

export default AppMessage;