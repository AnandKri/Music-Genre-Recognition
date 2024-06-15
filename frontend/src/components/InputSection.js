import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function InputSection() {

  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (event) => {

    event.preventDefault();
    navigate(`/results`, {state: {query}})

  }
  
  return (
    <div>
      <div className='py-6'>
        <form onSubmit={handleSubmit} className='justify-center text-center flex'>
          <input
            className='mx-2 justify-center px-3 py-2 border-2 border-gray-500 rounded-full'
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search for any Song'
          />
          <button type="submit" className='bg-emerald-500 rounded-full mx-2 px-3 font-medium hover:bg-emerald-700'>Search</button>
        </form>
      </div>
    </div>
  );
}
  
export default InputSection;