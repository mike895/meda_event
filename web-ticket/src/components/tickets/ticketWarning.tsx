import Paragraph from "antd/lib/typography/Paragraph";
import React from "react";

function TicketWarning() {
  return (
    <ol
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "start",
      }}
      className="paragraph-col"
    >
      <li>Keep this ticket private</li>
      <li>Do not share or duplicate this ticket</li>
      <li>The above ticket is valid for only one use</li>
    </ol>
  );
}

export default TicketWarning;
