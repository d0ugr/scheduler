import { useState } from "react";



export default function useVisualMode(initial) {

  const [ mode,    setMode    ] = useState(initial);
  const [ history, setHistory ] = useState([ initial ]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    (replace
      ? history[history.length - 1] = newMode
      : history.push(newMode)
    );
    setHistory([ ...history ]);
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
      setHistory([ ...history ]);
    }
  }

  return { mode, transition, back };

}



