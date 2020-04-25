import React    from "react";
import ReactDOM from "react-dom";
import axios    from "axios";

import "index.scss";

import Application from "components/Application";

// Set the base URL for API calls:
axios.defaults.baseURL = `${(
  process.env.REACT_APP_API_BASE_URL ||
  new URL(window.location).origin)}/api`;

ReactDOM.render(<Application />, document.getElementById("root"));
