import React from "react";
import ReactDOM from "react-dom";
// npm i --save react-transition-group
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

// קומפוננטה ל nav עם סגנון נפתח ימינה
// לא חייב
function SideDrawer(props) {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}

export default SideDrawer;
