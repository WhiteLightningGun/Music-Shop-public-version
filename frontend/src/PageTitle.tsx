import React from 'react';

interface Props {
  children: React.ReactNode;
}
export const PageTitle = ({ children }: Props) => (
  <h2 className="bg-warning">{children}</h2>
);
