import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <h1>layout1</h1>
      {children}
    </>
  );
}
