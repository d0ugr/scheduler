import { useState } from "react";



export default function useVisualMode(initial) {

  const [ mode,    setMode    ] = useState(initial);
  const [ history, setHistory ] = useState([ initial ]);
  // console.log("useVisualMode:", history);

  function transition(newMode) {
    setMode(newMode);
    history.push(newMode);
    setHistory([ ...history ]);
    // console.log("transition:", history);
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
      setHistory([ ...history ]);
      // console.log("back:", history);
    }
  }

  return {
    mode,
    transition,
    back
  };

}



