'use client';

import React from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarProvider({ children }: Props) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#2196f3"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
