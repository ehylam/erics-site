import { useState } from 'react';

function useToggle(initValue = false) {
  const [state, setState] = useState(initValue);
  const toggle = () => {
    setState(!state);
  };

  return [state, toggle];
}

export default useToggle;