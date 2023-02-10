import { useState, useRef, useEffect } from 'react';
import { SECTION_MAP } from './DocsConfig'
import { TextInput } from "../Form";
import { Link } from 'react-router-dom'
import './DocsSearch.css'


const DocsSearch = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };


  // Flattens the docs menu so all nodes are available in the autocomplete
  function flattenArray(array, path) {
    let result = [];
    result.push({ name: array[0], file: array[1], path: path});

    for (const [key, value] of Object.entries(array[2])) {
      result = result.concat(flattenArray(value, path + "/" + key));
    }
  
    return result;
  }

  const handleSelect = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  }

  const allSuggestions = flattenArray(SECTION_MAP, "/Docs");
  // We dont want the main to be searchable
  allSuggestions.shift()

  const handleChange = event => {
    setSearchTerm(event.target.value);
    var filteredSuggestions = [];

    if (event.target.value.length > 1) {
      // Filter the suggestions based on the search term
      filteredSuggestions = allSuggestions.filter(
        suggestion => suggestion.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    }  

    setSuggestions(filteredSuggestions);

    // Show the suggestions if there are any
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };


  return (
    <div className="search-box" ref={inputRef}>
      <TextInput
        type="text"
        id="input"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search Docs"
        
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map(suggestion => (
            <li key={suggestion.name}>
              <Link onClick={() => handleSelect(suggestion.name)} className="link" to={suggestion.path}>{suggestion.name}</Link>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocsSearch;
