import React from 'react';

const ScrollArea: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <div className={`overflow-auto ${className}`} style={{ maxHeight: '60vh' }}>
      {children}
    </div>
  );
};

export default ScrollArea;
