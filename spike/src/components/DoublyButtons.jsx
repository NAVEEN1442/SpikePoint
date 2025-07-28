import React from 'react';

function DoublyButtons({ 
  primaryText, 
  secondaryText, 
  onPrimaryClick, 
  onSecondaryClick 
}) {
  return (
    <div className="flex gap-4">
      {primaryText && (
        <button 
          onClick={onPrimaryClick}
          className="px-6 py-3  cursor-pointer w-[240px] h-[60px] bg-[#515DEF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          {primaryText}
        </button>
      )}

      {secondaryText && (
        <button 
          onClick={onSecondaryClick}
          className="px-6 py-3 cursor-pointer  w-[240px] h-[60px] bg-gray-200 text-gray-800 rounded-lg shadow-[#EDEDED] shadow-inner font-medium hover:bg-gray-300 transition-colors duration-200"
        >
          {secondaryText}
        </button>
      )}
    </div>
  );
}

export default DoublyButtons;
