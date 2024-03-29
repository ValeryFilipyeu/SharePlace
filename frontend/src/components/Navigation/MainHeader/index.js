import React from "react";
import PropTypes from "prop-types";

import "./index.css";

const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
};

MainHeader.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainHeader;
