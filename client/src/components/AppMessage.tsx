import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { MessageInfo, defaultDisplayDuration, setMessageMustBeDisplayed, showNextMessage } from '../App/appSlice';
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
    const mustBeDisplayed = useAppSelector(state => state.app.messageMustBeDisplayed);
    const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let generalStyles = 'fixed left-0 bottom-0 transition-all duration-[2s] p-1 mb-1 rounded-[0.5em] border-2 border-solid border-gray-600 bg-white inline-flex flex-row items-center ';
    generalStyles += !mustBeDisplayed ? '-translate-x-full ease-in' : 'ml-1 ease-out';
    function scheduleHiding(event: React.TransitionEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
        const nativeEvent: MouseEvent | TransitionEvent = event.nativeEvent;
        if (nativeEvent instanceof TransitionEvent && nativeEvent.propertyName !== 'transform') {
            return;
        }
        if (timerIdRef.current) {
            clearTimeout(timerIdRef.current);
        } else if (event.type === 'click') {
            // if timerId is not set yet, then only transitionEnd for transform can set it
            return;
        }
        // console.log(new Date().toLocaleTimeString());
        timerIdRef.current = setTimeout(() => {
            dispatch(setMessageMustBeDisplayed(false));
            timerIdRef.current = null;
            // console.log(new Date().toLocaleTimeString());
        }, props.displayDuration ?? defaultDisplayDuration);
    }
    function hideMessage(event: React.MouseEvent<SVGElement>) {
        event.stopPropagation();// click on parent div must not fire
        dispatch(setMessageMustBeDisplayed(false))
    }
    return (
        <div className={generalStyles}
            onTransitionEnd={event => mustBeDisplayed ? scheduleHiding(event) : dispatch(showNextMessage())}
            onClick={event => mustBeDisplayed ? scheduleHiding(event) : dispatch(setMessageMustBeDisplayed(true))}>
            {icons[props.type ?? 'success']}
            <span className='leading-none'>{props.children}</span>
            <CloseCircle className='h-[1em] ml-1' fill='slategray'
                onClick={event => hideMessage(event)} />
        </div>
    );
}

export default AppMessage;