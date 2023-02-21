import React, { Fragment, useState } from "react";
import TableCell from "@mui/material/TableCell";

export default function TableExtendableTextCell({ text, ...cellProps }) {
  const [isTextExtended, setIsTextExtended] = useState(false);

  let textIsShort = text.length < 20;

  const cutContent = (
    <Fragment>
      {text.substring(0, 20)}
      <span onClick={() => setIsTextExtended(true)}>...</span>
    </Fragment>
  );

  const extendedContent = (
    <Fragment>
      {text}
      <span onClick={() => setIsTextExtended(false)}>{"<<"}</span>
    </Fragment>
  );

  return (
    <TableCell {...cellProps}>
      {!text ? "-" : textIsShort ? text : isTextExtended ? extendedContent : cutContent}
    </TableCell>
  );
}
