import React, { useEffect } from 'react';

function WorkspaceZone({ navigate }) {
  useEffect(() => {
    window.open('https://server-ckb7.onrender.com', '_blank');
    navigate('dashboard');
  }, [navigate]);

  return null;
}

export default WorkspaceZone;
