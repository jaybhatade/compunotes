import React, { useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

function AddBtn() {
  const [clicked, setClicked] = useState(false);

  // Reset the click state after the animation completes
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Duration of the animation (adjust as needed)
  };

  return (
    <Link
      to={"/add"}
      onClick={handleClick}
      className={`fixed bottom-28 right-4 rounded-full bg-zinc-400 h-16 w-16 flex items-center justify-center 
        ${clicked ? 'scale-90' : 'scale-100'} transition-transform duration-300 
        hover:scale-125`} // Adds a hover effect to scale up the button
    >
      <IoIosAddCircleOutline color='white' size={40} />
    </Link>
  );
}

export default AddBtn;
