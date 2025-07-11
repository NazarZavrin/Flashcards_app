import React, { memo } from 'react';
import loader from '../assets/spinner.gif';

const image = new Image();
image.src = loader; // Preload the image

const ButtonLoader = memo(function (props: React.ComponentProps<'img'>) {
    return <img src={loader} alt='Loading...' {...props} />;
});

export default ButtonLoader;