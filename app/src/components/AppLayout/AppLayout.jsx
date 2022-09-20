import React, { Fragment } from "react";
import TopMenuBar from "./TopMenuBar";

const AppLayout = (props) => {
  return (
    <Fragment>
      <TopMenuBar />
      {props.children}
    </Fragment>
  );
};

export default AppLayout;
