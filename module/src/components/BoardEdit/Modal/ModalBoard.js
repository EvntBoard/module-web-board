import React from 'react'
import { Modal, Button } from "antd";
import { Form as FForm, Field } from "react-final-form";

import { FieldInput } from "../../Field/FieldInput";
import { FieldCheckbox } from "../../Field/FieldCheckbox";
import { FieldColor } from "../../Field/FieldColor";

const ModalBoard = ({ open, onSubmit, onReset, current }) => {

  if (!open) {
    return null
  }

  return (
    <Modal title="Board modification" visible={open} onOk={onReset} onCancel={onReset} footer={null}>
      <FForm
        onSubmit={onSubmit}
        initialValues={current}
        render={({ handleSubmit, form }) => {
          const innerHandleCloseModal = () => {
            form.restart()
            onReset()
          }
          return (
            (
              <form onSubmit={handleSubmit}>
                <Field
                  name="slug"
                  label="Slug"
                  render={FieldInput}
                />
                <Field
                  name="name"
                  label="Name"
                  validate={(value) => (value ? undefined : "A name is required ...")}
                  render={FieldInput}
                />
                <Field
                  name="width"
                  label="width"
                  render={FieldInput}
                />
                <Field
                  name="height"
                  label="height"
                  render={FieldInput}
                />
                <Field
                  name="description"
                  label="description"
                  render={FieldInput}
                />
                <Field
                  name="default"
                  label="default"
                  render={FieldCheckbox}
                />
                <Field
                  name="image"
                  label="image"
                  render={FieldInput}
                />
                <Field
                  name="color"
                  label="color"
                  render={FieldColor}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button style={{ marginTop: 8, marginLeft: 4, marginRight: 4 }} onClick={innerHandleCloseModal}>Cancel</Button>
                  <Button style={{ marginTop: 8, marginLeft: 4, marginRight: 4 }} type='primary' htmlType='submit'>Submit</Button>
                </div>
              </form>
            )
          )
        }}
      />
    </Modal>
    );
}

export default ModalBoard
