import React from "react";
import { Form, Input } from "antd";

export const FieldInput = ({ input, meta, label }) => (
  <Form.Item
    label={label}
    validateStatus={meta.touched && meta.error ? 'error': null}
    help={meta.touched && meta.error ? meta.error: null}
  >
    <Input {...input} />
  </Form.Item>
)