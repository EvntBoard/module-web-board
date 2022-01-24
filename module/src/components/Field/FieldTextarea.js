import React from "react";
import { Form, Input } from "antd";

export const FieldTextArea = ({ input, meta, label }) => (
  <Form.Item
    label={label}
    validateStatus={meta.touched && meta.error ? 'error': null}
    help={meta.touched && meta.error ? meta.error: null}
  >
    <Input.TextArea {...input} />
  </Form.Item>
)