import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { IUser } from '../interfaces/User';
import { useAxiosContext } from './AxiosContext';
import { useSocketContext } from './SocketContext';

export interface IUserContext {
  currentUser: IUser | undefined;
  login: Function;
  logout: Function;
  loading: boolean;
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

export const UserProvider = (props: { children: ReactElement }) => {
  const axiosContext = useAxiosContext();
  const socket = useSocketContext();
  const { children } = props;

  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    setLoading(true);
    const session = window.localStorage.getItem('token');
    if (session) {
      axiosContext
        .loginWithToken(session)
        .then((res: any) => {
          if (res.success) {
            message.success('Login saved');
            window.localStorage.setItem('currentUser', res.user.userName);
            setCurrentUser({
              username: res.user.userName,
            });
            history('/dashboard');
          } else {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('currentUser');
            message.error('Failed to retrieve saved login');
          }
          setLoading(false);
          return res;
        })
        .catch((err: any) => message.error(err));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (username: string, password: string, cb: Function) => {
    axiosContext
      .login(username, password)
      .then((result: any) => {
        if (result.success) {
          message.success('Logged In');
          window.localStorage.setItem('token', result.token);
          window.localStorage.setItem('currentUser', username);
          setCurrentUser({
            username,
          });
          history('/dashboard');
        } else {
          message.error('Login Failed');
        }
        return result;
      })
      .catch((err: any) => message.error(err));
    cb();
  };
  const logout = () => {
    if(currentUser){
      axiosContext
      .logout(currentUser)
      .then((result: any) => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('currentUser');
        setCurrentUser(undefined);
        history('/dashboard');
        message.success('Logged Out');
        return result;
      })
      .catch((err: any) => message.error(err));
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): IUserContext => {
  const context = useContext<IUserContext>(UserContext);

  if (context === undefined) {
    throw new Error(`Error using DataProvider`);
  }
  return context;
};

export default UserContext;
