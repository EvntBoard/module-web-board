import React from "react";
import { Checkbox, Form } from "antd";

export const FieldCheckbox = ({ input, meta, label }) => {
  const handleOnChange = (e) => {
    input.onChange(e.target.checked)
  }
  return (
    <Form.Item
      label={label}
      validateStatus={meta.touched && meta.error ? 'error': null}
      help={meta.touched && meta.error ? meta.error: null}
    >
      <Checkbox {...input} onChange={handleOnChange} checked={input.value} />
    </Form.Item>
  )
}