import { useState, useEffect } from "react";

const useWebSocket = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      setData(JSON.parse(event.data)); // JSON 데이터 변환
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    return () => socket.close();
  }, [url]);

  return data;
  
};

export default useWebSocket;
