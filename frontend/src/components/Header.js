import React from 'react';
import logo from '../images/logo_2.svg';

function Header() {
    return (
      <>
      <div className='bg-slate-200'>
        <div className='p-2 mx-auto lg:w-2/3 text-center'>
            <div className='align-middle inline-block'>
                <img src={logo} 
                alt='MGR_logo' 
                className='w-16 p-2 md:w-24 md:p-2 lg:w-24 lg:p-1 animate-spin'
                />
            </div>
            <div className='inline-block text-xl font-medium align-middle md:text-2xl md:font-semibold md:px-1 lg:text-3xl lg:font-bold lg:px-4'>
                Music Genre Recognition
            </div>
        </div>
      </div>
      </>
    );
  }
  
export default Header;