import React, {useEffect, useMemo} from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShareAltOutlined,
  WifiOutlined,
} from '@ant-design/icons';

import { BoardEditItem } from './components/BoardEditItem'
import { BoardEdit } from './components/BoardEdit'
import { BoardView } from './components/BoardView'
import useLocalStorage from "./hooks/useLocalStorage";
import { actions } from './store/board'
import EvntBoardLogo from "./assets/logo.png";

const { Content, Sider } = Layout;

export const Root = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch()
  const [ collapsed , setCollapsed ] = useLocalStorage('collapsed', false)
  const [ selected, setSelected ] = useLocalStorage('menu', 'view');

  useEffect(() => {
    dispatch(actions.wsConnect())
    return () => {
      dispatch(actions.wsDisconnect())
    }
  }, [dispatch])

  useEffect(() => {
    let item = location.pathname.replace('/', '')
    if (item === '') {
      item = 'view'
    }
    setSelected(item)
  }, [location, setSelected])

  const hideLayout = useMemo(() => {
    return location.search === '?standalone'
  }, [location.search])

  const onCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleOnClickMenu = ({ key }) => {
    if (key === 'standalone') {
      const win = window.open(`/modules/module-board/#/?standalone`, "_blank")
      win.focus();
    } else {
      if (key === 'view') {
        history.push('/');
      } else {
        history.push(`/${key}`);
      }
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {
        !hideLayout && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <div className="logo">
              <img className="img" src={EvntBoardLogo}  alt='' />
              {!collapsed && <div className="title">Board</div>}
            </div>
            <Menu theme={'dark'} selectedKeys={[selected]} mode="inline">
              <Menu.Item key="view" icon={<WifiOutlined />} onClick={handleOnClickMenu}>
                Mode View
              </Menu.Item>
              <Menu.Item key="edit" icon={<DashboardOutlined />} onClick={handleOnClickMenu}>
                Mode Edit
              </Menu.Item>
              <Menu.Item key="standalone" icon={<ShareAltOutlined />} onClick={handleOnClickMenu}>
                Mode Standalone
              </Menu.Item>
            </Menu>
          </Sider>
        )
      }
      <Layout className="site-layout" style={!hideLayout ? collapsed ? { marginLeft: 80 } : { marginLeft: 200 } : null}>
        <Content className='board'>
          <Switch>
            <Route exact path="/edit">
              <BoardEdit />
            </Route>
            <Route path="/edit/:boardId">
              <BoardEditItem />
            </Route>
            <Route path="/">
              <BoardView />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
};
