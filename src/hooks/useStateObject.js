// useStateObject.js
//
// Enhanced useState wrapper hook.

import { useState, useCallback } from "react";

// useStateObject is an enhanced useState wrapper hook.
//    All state values are stored in the state object.
//    state and setState are exposed for external use,
//    but updateState is what this is all about.

export default function useStateObject(defaultState) {

  const [ state, setState ] = useState(defaultState);

  // updateState adds/updates properties in the state object above.
  //    If data is not an object, nothing happens.
  //    If it contains "name" and "value" properties,
  //    (i.e. from <input> attributes) those are used to set the value as a
  //    "name: value" property in the state object.
  //    Otherwise, the object is simply copied into the state object.
  //    Existing properties will be updated if they exist.

  const updateState = useCallback((data) => {
    if (typeof data === "object") {
      //setState((prev) =>
      setState({
        ...state,
        ...(data.name && data.value ? { [data.name]: data.value } : data)
      });
    }
  }, [ state ]);

  // resetState sets state to default values
  //    that were initially passed to useStateObject.

  const resetState = useCallback(() =>
    setState({ ...defaultState }),
    [ defaultState ]
  );

  return { state, setState, updateState, resetState };

};
