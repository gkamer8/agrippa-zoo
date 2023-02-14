import { useState, useRef, useEffect } from 'react';
import { SECTION_MAP } from './DocsConfig'
import { TextInput } from "../Form";
import { Link } from 'react-router-dom'
import './DocsSearch.css'
import { useNavigate } from "react-router-dom";


const DocsSearch = ({searchTerm: incomingSearchTerm, setParentSearchTerm}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(incomingSearchTerm);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  // Allow parent to update search term
  useEffect(() => {
    setSearchTerm(incomingSearchTerm);
  }, [incomingSearchTerm]);


  // If the user types a little bit and then clicks - close the dropdown
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          hideSuggestions()
        }
      };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  // Flattens the docs menu so all nodes are available in the autocomplete
  function flattenArray(array, path) {
    let result = [];
    result.push({ name: array[0], file: array[1], path: path});

    for (const [key, value] of Object.entries(array[2])) {
      result = result.concat(flattenArray(value, path + "/" + key));
    }
  
    return result;
  }

  // Flattens the docs menu so all nodes are available in the autocomplete
  function hideSuggestions() {
    setShowSuggestions(false);
    setSelectedIndex(null)
  }

  // If the user selects somethign from the dropdown, close it, autofill, and navigate
  const handleSelect = (index) => {
    navigate(suggestions[index].path)
    setSearchTerm(suggestions[index].name);
    hideSuggestions()
  }

  // Creating the appropriate suggestions
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
      hideSuggestions()
    }
  };

  // Do stuff on arrows or enter key
  const handleKeyDown = event => {
    switch (event.keyCode) {
      case 38: // up arrow
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1);
        break;
      case 40: // down arrow
        setSelectedIndex(selectedIndex === null || selectedIndex === suggestions.length - 1 ? 0 : selectedIndex + 1);
        break;
      case 13: // enter
        if (suggestions.length > 0) {
          handleSelect(selectedIndex !== null ? selectedIndex : 0);
        }
        break;
      default:
        break;
    }
  };


  return (
    <div className="search-box" ref={inputRef}>
      <TextInput
        type="text"
        id="input"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Docs"
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.name}>
              <Link to={suggestion.path} onClick={() => handleSelect(index)} className={`sug-link ${selectedIndex === index ? "selected_docs" : ""}`}>{suggestion.name}</Link>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocsSearch;
