import React from 'react'

function Banner2({ title, model,active }) {
  return (
   <div
      className={`flex! items-center! justify-center! ${
        active === 'true' ? 'h-[60vh]!' : 'h-[80vh]!'
      } px-4! text-center! md:w-1/2! md:mx-auto!`}
    >
      <div>
        <h2 className="text-xl! md:text-2xl! font-bold! text-zinc-300!">{title}</h2>
        <p className="mt-4! text-sm! md:text-md! text-gray-300!">{model}</p>
      </div>
    </div>
  );
}


export default Banner2


