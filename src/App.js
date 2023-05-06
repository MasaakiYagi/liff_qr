import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import QRCodeScanner from "react-qr-scanner";

const LIFF_ID = process.env.REACT_APP_LIFF_ID;

function App() {
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [mode, setMode] = useState(null);
  const [stationaryId, setStationaryId] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      await liff.init({ liffId: LIFF_ID });
      setLiffInitialized(true);

      const urlParams = new URLSearchParams(window.location.search);
      setMode(urlParams.get("mode"));
    };

    initializeLiff();
  }, []);

  const handleQRCodeRead = (data) => {
    if (data) {
      setStationaryId(data);
    }
  };

  const sendMessage = async (message) => {
    if (liffInitialized) {
      await liff.sendMessages([
        {
          type: "text",
          text: message,
        },
      ]);

      liff.closeWindow();
    }
  };

  const handleMessageSend = () => {
    let message;
    if (mode === "purchase") {
      message = `購入\n${stationaryId}`;
    } else if (mode === "favorite") {
      message = `お気に入り追加\n${stationaryId}`;
    } else if (mode === "column") {
      message = `コラム\n${stationaryId}`;
    } else {
      return;
    }

    sendMessage(message);
  };

  return (
    <div className="App">
      <h1>LIFF QR Code Scanner</h1>
      {liffInitialized && (
        <>
          <QRCodeScanner
            onRead={handleQRCodeRead}
            style={{ width: "100%", height: "auto" }}
          />
          {stationaryId && (
            <button onClick={handleMessageSend}>メッセージを送信</button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
