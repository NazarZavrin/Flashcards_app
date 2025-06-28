import React from 'react';
import loader from '../assets/spinner.gif';

function ButtonLoader(props: React.ComponentProps<'img'>) {
    return <img className={'max-h-[1em] ' + props.className} src={loader} alt='Loading...'/>;
}

export default ButtonLoader;