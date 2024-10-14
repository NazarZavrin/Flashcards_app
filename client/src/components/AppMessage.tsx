import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { MessageInfo, setMustBeDisplayed } from '../App/appSlice';
// import success from '../assets/success-circle.svg';
import { ReactComponent as Success } from '../assets/success-circle.svg';
import { ReactComponent as Info } from '../assets/info-circle.svg';
import { ReactComponent as Warning } from '../assets/warning-triangle.svg';
import { ReactComponent as Error } from '../assets/error-circle.svg';
// import info from '../assets/info-circle.svg';
// import warning from '../assets/warning-triangle.svg';
// import error from '../assets/error-circle.svg';
import { ReactComponent as CloseCircle } from '../assets/close-circle.svg';
import capitalize from '../utils/capitalize';
// import close2 from '../assets/close-.svg';
// import svg from '../assets/xmark-solid.svg';

interface Props extends React.ComponentProps<'div'>, Omit<MessageInfo, 'text'> {
    children: MessageInfo['text']
}

/*const icons: Record<NonNullable<MessageInfo['type']>, string> = {
    success, info, warning, error,
}*/
const icons: Record<NonNullable<MessageInfo['type']>, React.ReactNode> = {
    success: <Success fill='limegreen' className='h-[1em] mr-1' />,
    info: <Info fill='dodgerblue' className='h-[1em] mr-1' />,
    warning: <Warning fill='orange' className='h-[0.95em] mr-1' />,
    error: <Error fill='red' className='h-[0.9em] mr-1' />,
}
// lime rgb(0,255,0, 0.49)
function AppMessage(props: Props) {
    const dispatch = useAppDispatch();
    const mustBeDisplayed = useAppSelector(state => state.app.mustBeDisplayed);
    const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let generalStyles = 'fixed left-0 bottom-0 transition-all duration-[1s] p-1.5 mb-1 rounded-[0.5em] border-2 border-solid border-gray-600 bg-white inline-flex flex-row items-center items-end ';
    generalStyles += !mustBeDisplayed ? '-translate-x-full ease-in' : 'ml-1 ease-out';
    console.log(capitalize(props.type ?? 'undefined'));
    function scheduleHiding() {
        if (mustBeDisplayed) {
            /* if the transition ended while the message is marked as the one that 
            must be displayed, then we have to schedule its hiding */
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }
            // console.log(new Date().toLocaleTimeString());
            return;
            timerIdRef.current = setTimeout(() => {
                dispatch(setMustBeDisplayed(false));
                // console.log(new Date().toLocaleTimeString());
            }, props.displayDuration ?? 11000);// 3000
            // dispatch(scheduleHiding());
        }
        // messageText.length > 0 ? () => dispatch(setMessage('')) : () => 0
    }
    console.log('---');
    return (
        // props.children.length > 0 ? // className={generalStyles + ' ' + messageStyles[props.type ?? 'success']}
        <div className={generalStyles}
            onTransitionEnd={event => event.propertyName === 'transform' ? scheduleHiding() : 0}
            onClick={() => mustBeDisplayed ? scheduleHiding() : dispatch(setMustBeDisplayed(true))}>
            {icons[props.type ?? 'success']}
            <span className='leading-none'>{props.children}</span>
            {/* <img src={close} alt='Close' className='h-[1em] ml-0.5' /> */}
            <CloseCircle className='h-[1em] ml-1' fill='slategray' 
                onClick={() => dispatch(setMustBeDisplayed(false))} />
            {/* <img src={closeCircle} alt='Close' className='h-[1em] ml-1' 
                onClick={() => dispatch(setMustBeDisplayed(false))} />*/}
        </div> //: null
    );
}

export default AppMessage;