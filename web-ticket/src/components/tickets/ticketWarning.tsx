import Paragraph from "antd/lib/typography/Paragraph";
import React from "react";

function TicketWarning() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className="paragraph-col"
    >
      <Paragraph>1. Keep this ticket private</Paragraph>
      <Paragraph>2. Do not share or duplicate this ticket.</Paragraph>
      <Paragraph>3. The above ticket is valid for only one use</Paragraph>
    </div>
  );
}

export default TicketWarning;
