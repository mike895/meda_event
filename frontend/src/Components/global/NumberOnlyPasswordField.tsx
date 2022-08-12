import { AutoComplete, Form, Input } from "antd";
import React, { useState } from "react";

export default function NumberOnlyPasswordField({
  inputProps,
  value = "",
  onChange,
}: any) {
  const handleChange = (value: string) => {
    if (!Number(value) && value.length > 0) {
      return;
    }
    // Then
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <Input.Password
      {...inputProps}
      value={value}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
    ></Input.Password>
  );
}
