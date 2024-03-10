import React from 'react';

const Button = ({ onClick, children, disabled, isResetButton }) => (
    <button 
      className={`px-3 py-2 text-sm font-medium text-center rounded-lg focus:outline-none 
      ${disabled 
        ? 'text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed' 
        : isResetButton 
          ? 'text-white bg-red-600 hover:bg-red-700' // Стили для кнопки сброса
          : 'text-white bg-blue-700 hover:bg-blue-800 active:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      }`}
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
  

export default Button;