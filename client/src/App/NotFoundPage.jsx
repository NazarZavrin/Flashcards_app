import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage(props) {
    return (
        <section className='w-full h-full flex p-3'>
            <div className='m-auto text-center text-3xl text-gray-500 font-bold flex flex-col items-center justify-center'>
                The page you requested was not found 
                <Link to='/' className='text-base text-blue-700 font-normal underline hover:underline'>Back to home</Link>
            </div>
        </section>
    );
}

export default NotFoundPage;