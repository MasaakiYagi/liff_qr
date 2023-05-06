import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import ConfirmationModal from "./components/modal/ConfirmationModal";
import "./App.css";

const LIFF_ID = process.env.REACT_APP_LIFF_ID;

function App() {
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [mode, setMode] = useState(null);
  const [stationaryId, setStationaryId] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      await liff.init({ liffId: LIFF_ID }, () => {
        setLiffInitialized(true);

        const urlParams = new URLSearchParams(window.location.search);
        setMode(urlParams.get("mode"));
      });
    };

    initializeLiff();
  }, []);

  const handleQRCodeRead = async (scanResult) => {
    if (scanResult && scanResult.value) {
      setStationaryId(scanResult.value);
      await handleMessageSend(scanResult.value);
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

  const handleMessageSend = async (stationaryId) => {
    console.log(stationaryId);
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

    await sendMessage(message);
  };

  return (
    <div className="App">
      <h3 className="lead-message">商品のQRコードを読み取ってください</h3>
      {liffInitialized && (
        <>
          {!stationaryId && (
            <button
              className="scan-button"
              onClick={async () => {
                const result = await liff.scanCodeV2();
                await handleQRCodeRead(result);
              }}
            >
              SCAN
            </button>
          )}
          {stationaryId && (
            <ConfirmationModal
              stationaryId={stationaryId}
              handleMessageSend={handleMessageSend}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
