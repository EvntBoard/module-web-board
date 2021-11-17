import React from 'react'
import { Modal, Button } from "antd";
import { Form as FForm, Field } from "react-final-form";
import { FieldInput } from "../../Field/FieldInput";
import { FieldTextArea } from "../../Field/FieldTextarea";
import { FieldSelect } from "../../Field/FieldSelect";
import { FieldColor } from "../../Field/FieldColor";

const ModalCustomEvent = ({ open, onSubmit, onCancel, current }) => {
  if (!open) {
    return null
  }

  return (
    <Modal title="Button creation" visible={open} onCancel={onCancel} footer={null}>
      <FForm
        onSubmit={onSubmit}
        initialValues={current}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="slug"
              label="Slug"
              component={FieldInput}
            />
            <Field
              name="type"
              label="Type"
              component={FieldSelect}
              options={[
                {
                  value: 'text',
                  label: 'Text'
                },
                {
                  value: 'button',
                  label: 'Button'
                },
                {
                  value: 'switch-board',
                  label: 'Switch board'
                },
              ]}
            />

            <Field
              name="type"
              render={({ input }) => {
                if (input.value !== 'switch-board') {
                  return null
                }
                return (
                  <Field
                    name="board_slug"
                    label="Go to Board"
                    component={FieldInput}
                  />
                )
              }}
            />
            <Field
              name="text"
              label="Text"
              component={FieldTextArea}
            />
            <Field
              name="color"
              label="Color"
              component={FieldColor}
            />
            <Field
              name="image"
              label="Image"
              component={FieldInput}
            />

            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginTop: 8, marginLeft: 4, marginRight: 4 }} onClick={onCancel}>Cancel</Button>
              <Button style={{ marginTop: 8, marginLeft: 4, marginRight: 4 }} type='primary' htmlType='submit'>Submit</Button>
            </div>
          </form>
        )}
      />
    </Modal>
    );
}

export default ModalCustomEvent
