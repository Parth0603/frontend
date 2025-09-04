import React, { useRef, useEffect, useState } from 'react';

function Whiteboard({ isHost = false, socket, roomId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [canvasData, setCanvasData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socket && !isHost) {
      socket.on('whiteboard-draw', (data) => {
        drawOnCanvas(data);
      });

      socket.on('whiteboard-clear', () => {
        clearCanvas();
      });
      
      socket.on('whiteboard-state', (data) => {
        if (data && canvas) {
          const img = new Image();
          img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = data;
        }
      });
    }
    
    // Save canvas state when component unmounts or whiteboard closes
    return () => {
      if (canvas && isHost) {
        setCanvasData(canvas.toDataURL());
      }
    };

    return () => {
      if (socket) {
        socket.off('whiteboard-draw');
        socket.off('whiteboard-clear');
      }
    };
  }, [socket, isHost]);

  const drawOnCanvas = (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.globalCompositeOperation = data.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;
    
    ctx.beginPath();
    ctx.moveTo(data.prevX, data.prevY);
    ctx.lineTo(data.currentX, data.currentY);
    ctx.stroke();
  };

  const startDrawing = (e) => {
    if (!isHost) return;
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLastPos({ x, y });
  };

  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const draw = (e) => {
    if (!isDrawing || !isHost) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Emit drawing data to other users
    if (socket && roomId) {
      socket.emit('whiteboard-draw', {
        roomId,
        prevX: lastPos.x,
        prevY: lastPos.y,
        currentX,
        currentY,
        color: currentColor,
        lineWidth,
        tool: currentTool
      });
    }
    
    setLastPos({ x: currentX, y: currentY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    if (!isHost) return;
    clearCanvas();
    setCanvasData(null);
    if (socket && roomId) {
      socket.emit('whiteboard-clear', { roomId });
    }
  };
  
  // Send current canvas state when whiteboard opens
  useEffect(() => {
    if (isHost && socket && roomId && canvasData) {
      socket.emit('whiteboard-state', { roomId, data: canvasData });
    }
  }, [isHost, socket, roomId, canvasData]);

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="whiteboard">
      {isHost && (
        <div className="whiteboard-header">
          <div className="whiteboard-tools">
            <button 
              className={`tool-btn ${currentTool === 'pen' ? 'active' : ''}`}
              onClick={() => setCurrentTool('pen')}
            >
              <i className="fas fa-pen"></i>
            </button>
            <button 
              className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`}
              onClick={() => setCurrentTool('eraser')}
            >
              <i className="fas fa-eraser"></i>
            </button>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="color-picker"
            />
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
              className="line-width"
            />
            <button className="tool-btn" onClick={handleClear}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="whiteboard-actions">
            <button className="action-btn" onClick={saveCanvas}>
              <i className="fas fa-save"></i>
              Save
            </button>
          </div>
        </div>
      )}
      <div className="whiteboard-canvas">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ cursor: isHost ? (currentTool === 'eraser' ? 'crosshair' : 'crosshair') : 'default' }}
        />
      </div>
    </div>
  );
}

export default Whiteboard;