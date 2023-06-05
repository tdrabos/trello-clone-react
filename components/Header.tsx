'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {MagnifyingGlassIcon, UserCircleIcon} from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'

function Header() {
    const [board, searchString, setSearchString] = useBoardStore((state) => [
        state.board,
        state.searchString,
        state.setSearchString
    ]);

    // TODO: implement search debounce

  return (
    <header>
        <div className='flex flex-col md:flex-row items-center
        p-5 bg-gray-500/10 rounded-b-2xl'>

            <div className='absolute top-0 left-0 w-full
            h-96 bg-gradient-to-br from-pink-400 to-[#0055D1]
            rounded-md blur-3xl opacity-50 -z-50'/>

            <Image 
            src="/../public/Trello_logo.png"
            alt="Trello logo"
            width={300}
            height={100}
            className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
            />

            <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
                <form className='flex items-center space-x-5
                bg-white rounded-md p-2 shadow-md
                flex-1 md:flex-initial'>
                    <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                    <input
                        type="text"
                        placeholder='Search'
                        className='flex-1 outline-none p-2'
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}/>
                    <button
                        type='submit'
                        hidden
                    >
                        Search
                    </button>
                </form>

                <Avatar name='Tamas Drabos' size='50' round color='#0055D1'/>
            </div>
        </div>
    </header>
  )
}

export default Header
