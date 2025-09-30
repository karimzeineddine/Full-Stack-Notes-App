import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IoMdClose } from 'react-icons/io';


const SearchBar = ({value, onChange, handleSearch, onClearSearch}) => {

  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md '>
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          placeholder="Search Notes" 
          className='w-full text-xs bg-transparent py-[11px] outline-none'
        />
        {value && (
            <IoMdClose className='text-xl text-slate-500 curor-pointer hover:text-black mr-2' onClick={onClearSearch} />
        )}
<FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 cursor-pointer hover:text-black" onClick={handleSearch} />
        
    </div>
  )
}

export default SearchBar