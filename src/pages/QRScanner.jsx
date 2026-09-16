import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { parseUpiPayload } from "../utils/qrParser.js";

function classifyCameraError(error) {
  const text = String(
    error?.name || error?.message || error || "",
  ).toLowerCase();
  if (
    text.includes("notallowed") ||
    text.includes("permission") ||
    text.includes("denied")
  )
    return "denied";
  if (
    text.includes("notreadable") ||
    text.includes("in use") ||
    text.includes("busy") ||
    text.includes("track start")
  )
    return "busy";
  if (
    text.includes("notfound") ||
    text.includes("no camera") ||
    text.includes("device not found")
  )
    return "missing";
  if (
    text.includes("notsupported") ||
    text.includes("secure context") ||
    !navigator.mediaDevices?.getUserMedia
  )
    return "unsupported";
  return "unknown";
}

const CAMERA_MESSAGES = {
  denied: {
    title: "Camera access denied",
    body: "Allow camera permission in your browser settings and try again.",
  },
  missing: {
    title: "No camera detected",
    body: "Connect or enable a camera to scan a QR code.",
  },
  busy: {
    title: "Camera is currently in use",
    body: "Close other apps using the camera and try again.",
  },
  unsupported: {
    title: "Camera scanning isn't supported here",
    body: "Try using Chrome or another modern browser.",
  },
  unknown: {
    title: "Unable to start camera",
    body: "We couldn't access the camera. Please try again.",
  },
};

export default function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const runRef = useRef(0);
  const mountedRef = useRef(true);
  const operationRef = useRef(Promise.resolve());
  const decodedRef = useRef(false);
  const [status, setStatus] = useState("starting");
  const [errorType, setErrorType] = useState(null);
  const [message, setMessage] = useState("Requesting camera access...");

  const releaseVideoTracks = () => {
    const reader = document.getElementById("upi-safe-reader");
    reader?.querySelectorAll("video").forEach((video) => {
      const stream = video.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    });
  };

  const cleanupScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    try {
      if (scanner) {
        if (scanner.isScanning) await scanner.stop();
        await scanner.clear();
      }
    } catch (error) {
      console.error("QR Scanner cleanup error:", error);
    } finally {
      releaseVideoTracks();
    }
  };

  const queueScannerOperation = (operation) => {
    const next = operationRef.current.then(operation, operation);
    operationRef.current = next.catch(() => {});
    return next;
  };

  const stopScanner = () => queueScannerOperation(cleanupScanner);

  const startScanner = () => {
    const run = ++runRef.current;
    return queueScannerOperation(async () => {
      await cleanupScanner();
      if (!mountedRef.current || run !== runRef.current) return;
      setStatus("starting");
      setErrorType(null);
      setMessage("Requesting camera access...");
      decodedRef.current = false;
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorType("unsupported");
        setStatus("error");
        return;
      }

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (run !== runRef.current || !mountedRef.current) return;
        if (!cameras.length) throw new Error("No camera detected");
        const environmentCamera = cameras.find((camera) =>
          /back|rear|environment/i.test(camera.label),
        );
        const cameraId = environmentCamera?.id || cameras[0].id;
        const onDecode = async (payload) => {
          const payment = parseUpiPayload(payload);
          if (!payment) {
            setStatus("invalid");
            setMessage("Please scan a valid UPI payment QR.");
            return;
          }
          if (decodedRef.current) return;
          decodedRef.current = true;
          await stopScanner();
          if (!mountedRef.current || run !== runRef.current) return;
          setStatus("success");
          navigate("/verify", { state: { from: "/scan", payment } });
        };
        const config = {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        };
        try {
          const scanner = new Html5Qrcode("upi-safe-reader");
          scannerRef.current = scanner;
          await scanner.start(cameraId, config, onDecode, () => {});
        } catch (firstError) {
          console.error("QR Scanner Error:", firstError);
          await cleanupScanner();
          if (run !== runRef.current) return;
          if (cameras.length < 2 || cameraId === cameras[0].id)
            throw firstError;
          const fallback = new Html5Qrcode("upi-safe-reader");
          scannerRef.current = fallback;
          await fallback.start(cameras[0].id, config, onDecode, () => {});
        }
        if (mountedRef.current && run === runRef.current) {
          setStatus("scanning");
          setMessage("Camera active. Point it at a UPI payment QR.");
        }
      } catch (error) {
        console.error("QR Scanner Error:", error);
        await cleanupScanner();
        if (mountedRef.current && run === runRef.current) {
          setErrorType(classifyCameraError(error));
          setStatus("error");
        }
      }
    });
  };

  useEffect(() => {
    mountedRef.current = true;
    startScanner();
    return () => {
      mountedRef.current = false;
      runRef.current += 1;
      stopScanner();
    };
  }, []);

  const cancel = async () => {
    runRef.current += 1;
    await stopScanner();
    navigate("/");
  };
  const cameraError = CAMERA_MESSAGES[errorType] || CAMERA_MESSAGES.unknown;

  return (
    <div className="app-page scanner-page">
      <header className="page-header">
        <button onClick={cancel} className="icon-button" aria-label="Back">
          ←
        </button>
        <div>
          <p className="eyebrow">UPI SAFE</p>
          <h1>Scan QR</h1>
          <p className="page-subtitle">Point your camera at a UPI QR code</p>
        </div>
      </header>
      <main className="scanner-content">
        <div className="scanner-frame">
          <div id="upi-safe-reader" />
          <span className="scan-corner scan-corner-tl" />
          <span className="scan-corner scan-corner-tr" />
          <span className="scan-corner scan-corner-bl" />
          <span className="scan-corner scan-corner-br" />
          {(status === "starting" || status === "success") && (
            <p className="scanner-overlay">
              {status === "success" ? "QR decoded" : message}
            </p>
          )}
        </div>
        {status === "scanning" && (
          <p className="scanner-status">
            <span className="status-dot" />
            {message}
          </p>
        )}
        {status === "invalid" && (
          <div className="inline-error">
            <strong>Invalid QR Code</strong>
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="inline-error">
            <strong>{cameraError.title}</strong>
            <span>{cameraError.body}</span>
            <button onClick={startScanner} className="button button-secondary">
              Retry Camera
            </button>
          </div>
        )}
        <button
          onClick={cancel}
          className="button button-secondary scanner-cancel"
        >
          Cancel
        </button>
      </main>
    </div>
  );
}
