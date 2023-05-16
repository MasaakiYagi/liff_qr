import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

const LIFF_ID = process.env.REACT_APP_LIFF_ID;

function App() {
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [mode, setMode] = useState(null);
  const [stationaryId, setStationaryId] = useState("");
  const [debugMessage, setDebugMessage] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        setLiffInitialized(true);

        const urlParams = new URLSearchParams(window.location.search);
        setMode(urlParams.get("mode"));
      } catch (error) {
        console.error("Error initializing LIFF:", error);
        setDebugMessage("Error initializing LIFF:" + error);
      }
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

  const scanQRCode = async () => {
    if (liffInitialized && liff.isApiAvailable("scanCodeV2")) {
      try {
        const result = await liff.scanCodeV2();
        await handleQRCodeRead(result);
      } catch (error) {
        console.error("Error scanning QR code:", error);
        setDebugMessage("Error scanning QR code:" + error);
      }
    } else {
      console.error("scanCodeV2 API is not available.");
      setDebugMessage("scanCodeV2 API is not available.");
    }
  };

  return (
    <div className="App">
      <h3 className="lead-message">商品のQRコードを読み取ってください</h3>
      {liffInitialized && (
        <>
          <div className="scan-button-container">
            {!stationaryId && (
              <button className="scan-button" onClick={scanQRCode}>
                SCAN
              </button>
            )}

            {mode === "purchase" && (
              <button
                className="scan-button"
                onClick={() => sendMessage("支払い完了")}
              >
                支払い完了
              </button>
            )}
          </div>
        </>
      )}
      {debugMessage && <p>{debugMessage}</p>}
    </div>
  );
}

export default App;
