import { ReactElement } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { SessionProvider } from './SessionContext';
import { UserProvider } from './UserContext';
import { SocketProvider } from './SocketContext';
import { AxiosProvider } from './AxiosContext';

const ContextGroup = (props: { children: ReactElement }) => {
  const { children } = props;
  return (
    <Router>
      <AxiosProvider>
        <UserProvider>
          <SocketProvider>
            <SessionProvider>{children}</SessionProvider>
          </SocketProvider>
        </UserProvider>
      </AxiosProvider>
    </Router>
  );
};

export default ContextGroup;
