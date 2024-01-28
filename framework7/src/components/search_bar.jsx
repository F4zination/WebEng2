import React, { useState } from 'react';

/**
 * SearchBar component for searching places.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onEnterPressed - The function to be called when the enter key is pressed.
 * @param {React.Ref} props.myMapRef - The reference to the map component.
 * @returns {JSX.Element} The rendered SearchBar component.
 */
const SearchBar = ({ onEnterPressed, myMapRef }) => {
  const [query, setQuery] = useState('');

  /**
   * Handles the input change event.
   *
   * @param {Object} event - The input change event.
   */
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
  };

  /**
   * Handles the key down event.
   * Calls the onEnterPressed function when the enter key is pressed.
   *
   * @param {Object} event - The key down event.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
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