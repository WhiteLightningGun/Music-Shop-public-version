import React from 'react';
import { PageTitle } from './PageTitle';

interface Props {
  title?: string;
  children: React.ReactNode;
}
export const Page = ({ title, children }: Props) => (
  <div className="bg-primary">
    {title && <PageTitle>{title}</PageTitle>}
    {children}
  </div>
);
