import React, { ReactElement } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const PrivateRoute = (props: { children: any; path: string }) => {
  let auth = useUserContext();
  return (
    <Route
      // {...props.path}
      render={({ location }) =>
        auth.currentUser ? (
          props.children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
