import React from 'react';

export default function MessageBox(props) {
  const { variant = 'info', children } = props;
  const styles = {
    info: 'bg-blue-100 text-blue-700',
    danger: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
  };
  return (
    <div className={`p-4 rounded ${styles[variant] || styles.info}`}>{children}</div>
  );
}
