// useVisualMode.js
//
// Hook used to implement appointment transitions
//    and record their history.

import { useState } from "react";

export const EMPTY          = "EMPTY";
export const SHOW           = "SHOW";
export const CREATE         = "CREATE";
export const EDIT           = "EDIT";
export const SAVING         = "SAVING";
export const CONFIRM_DELETE = "CONFIRM_DELETE";
export const DELETING       = "DELETING";
export const ERROR_SAVE     = "ERROR_SAVE";
export const ERROR_DELETE   = "ERROR_DELETE";



export default function useVisualMode(initial) {

  const [ mode,    setMode    ] = useState(initial);
  const [ history, setHistory ] = useState([ initial ]);

  function transition(newMode, replace = false) {
    if (newMode !== mode) {
      setMode(newMode);
      (replace
        ? history[history.length - 1] = newMode
        : history.push(newMode)
      );
      setHistory([ ...history ]);
    }
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



