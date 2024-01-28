import React, { useState } from 'react';

const SearchBar = ({ onEnterPressed, myMapRef }) => {
  const [query, setQuery] = useState('');
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key == 'Enter') {
      onEnterPressed(query);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '8px', border: '1px solid #ccc', padding: '8px', width: "80%" }}>

      <input
        type="text"
        placeholder="Suche nach Orten..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;