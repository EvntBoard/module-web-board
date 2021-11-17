import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;

export const FieldSelect = ({ input, meta, label, options }) => (
  <Form.Item
    label={label}
    validateStatus={meta.touched && meta.error ? 'error': null}
    help={meta.touched && meta.error ? meta.error: null}
  >
    <Select {...input}>
      { options?.map((option) => (<Option key={option.value} value={option.value}>{option.label}</Option>)) }
    </Select>
  </Form.Item>
)