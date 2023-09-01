import React, { FC } from 'react';
import { Result } from 'antd';
import './BoundaryScreen.css';

export interface IBoundaryScreen {
  title: string;
  description: string;
  type: 'error' | 'success';
}
export const BoundaryScreen: FC<IBoundaryScreen> = ({
  title,
  description,
  type,
}: IBoundaryScreen) => {
  return <Result status={type} title={title} subTitle={description} />;
};
