import React, { useState } from 'react';
import '../style/FilterButton.css';

function FilterButton({ onClick, testId, text }) {
  const [clicked, setClicked] = useState(false);

  function filterClick() {
    setClicked(!clicked);
    onClick(text);
  }
  return (
    <button className="filter" type="submit" data-testid={`${text}-${testId}`} onClick={filterClick} style={{ backgroundColor: clicked ? '#22236e' : 'white' }}>
      <div className="filterText" style={{ color: clicked ? 'white' : '#22236e' }}>{text}</div>
    </button>
  );
}

export default FilterButton;
