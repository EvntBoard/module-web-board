import React, { useState } from "react";
import { Button, Popover, Table, Modal } from "antd";
import { Helmet } from "react-helmet";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import ModalBoard from "./Modal/ModalBoard";
import { actions, selectors } from '../../store/board';
import { SAMPLE_BOARD } from "../../utils/constants";
import generateStringId from "../../utils/generateStringId";

export const BoardEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(null)

  const boards = useSelector(selectors.getData)

  const handleCreateBoard = () => {
    setCurrent({...SAMPLE_BOARD})
  }

  const handleEditBoard = (board) => {
    setCurrent(board)
  }

  const handleDeleteBoard = (board) => {
    dispatch(actions.dataDelete(board))
  }

  const handleOnSubmit = (board, form) => {
    const data = {...board}
    if (!data.id) {
      data.id = generateStringId()
    }
    dispatch(actions.dataUpdate({
      ...data
    }))
    setCurrent(null)
    form.restart()
  }

  const handleCancel = () => {
    setCurrent(null)
  }

  const columns = [
    {
      title: 'Slug',
      key: 'slug',
      dataIndex: 'slug',
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Height',
      key: 'height',
      dataIndex: 'height',
    },
    {
      title: 'Width',
      key: 'width',
      dataIndex: 'width',
    },
    {
      title: '',
      key: 'action',
      width: 240,
      render: (data) => {
        const innerHandleEditBoard = () => {
          handleEditBoard(data)
        }
        const innerHandleOpenBoard = () => {
          history.push(`/edit/${data.id}`);
        }
        const innerHandleDeleteBoard = () => {
          Modal.confirm({
            title: `Do you want to delete this board ${data.name} ?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Be careful, this action will delete the configuration of this board !',
            onOk: () => {
              handleDeleteBoard(data)
            }
          });
        }

        return (
          <div style={{ display: 'flex', gap: 4 }}>
            <Popover content='Edit' trigger="hover">
              <Button icon={<EditOutlined />} onClick={innerHandleEditBoard} />
            </Popover>
            <Popover content='Open' trigger="hover">
              <Button icon={<FolderOpenOutlined />} onClick={innerHandleOpenBoard} />
            </Popover>
            <Popover content='Delete' trigger="hover">
              <Button icon={<DeleteOutlined />} onClick={innerHandleDeleteBoard}  />
            </Popover>
          </div>
        )
      },
    },
  ];

  return (
    <>
      <Helmet title='Boards' />
      <ModalBoard onSubmit={handleOnSubmit} onReset={handleCancel} current={current} open={!!current} />
      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        <h1>Board</h1>
        <div style={{ display: 'flex', gap: 4, paddingBottom: 8, alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
          <Button type='primary' onClick={handleCreateBoard}>Create</Button>
        </div>
        <Table bordered columns={columns} dataSource={boards?.sort((a,b) => a?.name?.localeCompare(b?.name))?.map(i => ({...i, key: i?.name}))} pagination={false} />
      </div>
    </>
  )
}