import React, { useState } from 'react'

function Details() {
  const [doctor,setDoctor]=useState()
  
  return (
    <div className='p-5 md:px-20'>
      <h2 className='font-bold text-[22px]'>Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-4'>
        {/* Doctor Detail*/}
        <div className='col-span-3 grid grid-cols-1 md:grid-cols-3'>
          {/*Doctor Image*/}
               <div>

               </div>
          {/*Doctor Info*/}
               <div className='col-span-2 '>
             
               </div>
        </div>
        <div>
         {/*Dcotor Suggestion*/}
        </div>
      </div>
    </div>
  )
}

export default Details