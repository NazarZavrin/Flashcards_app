import React, { memo } from 'react';
import loader from '../assets/rounded blocks gray.gif'

const image = new Image();
image.src = loader; // Preload the image

const AppLoader = memo(function (props: React.ComponentProps<'img'>) {
    return (
        <img src={loader} alt='Loading...' {...props} />
    );
});

export default AppLoader;