import React from 'react';

type Props = {};

const MyComponent: React.FC<Props> = () => {
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default MyComponent;
