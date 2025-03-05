// pages/scan-qr.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";

console.log("Initializing ScanQRPage...");

export default function ScanQRPage() {
  console.log("Rendering ScanQRPage component...");

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect: Initializing camera...");
    const initializeCamera = async () => {
      try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        console.log("Camera access granted. Enumerating devices...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        console.log("Available video devices:", videoDevices);
        if (videoDevices.length === 0) {
          console.error("No camera devices found.");
          setError("Nem található kamera eszköz");
          return;
        }
        setCameras(videoDevices);
        setSelectedCamera(videoDevices[0].deviceId);
        setHasCameraAccess(true);
        console.log("Selected camera:", videoDevices[0].deviceId);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Camera access denied:", err);
        setError(
          "Kamera hozzáférés megtagadva. Engedélyezze a kamera használatát!",
        );
      } finally {
        console.log("Camera initialization complete.");
        setIsLoading(false);
      }
    };
    initializeCamera();
  }, []);

  const handleScan = (result: any) => {
    console.log("handleScan called. Result:", result);
    if (!result || !result.text || result.text === "undefined") {
      console.warn("QR scan returned an empty or invalid result.");
      return;
    }
    try {
      console.log("Parsing QR result:", result.text);
      const parsedData = JSON.parse(result.text);
      console.log("Parsed data:", parsedData);
      if (parsedData.userId && parsedData.date) {
        console.log("Valid QR code scanned.");
        setResult(JSON.stringify(parsedData));
        setError(null);
      } else {
        console.error("Invalid QR code format.");
        setError("Érvénytelen QR kód formátum");
      }
    } catch (e) {
      console.error("Failed to parse QR code:", e);
      setError("Nem sikerült értelmezni a QR kódot");
    }
  };

  const handleError = (err: any) => {
    console.error("QR scanner error:", err);
    setError(`QR olvasási hiba: ${err?.message || "Ismeretlen hiba"}`);
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">QR kód olvasó</h1>
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Vissza a főoldalra
        </Link>
      </div>

      {isLoading && (
        <div className="text-center py-4">Kamera inicializálása...</div>
      )}

      {!isLoading && !hasCameraAccess && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error || "A kamera nem elérhető"}
          <button
            onClick={() => {
              console.log("Retrying camera initialization...");
              window.location.reload();
            }}
            className="mt-2 block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Újrapróbálkozás
          </button>
        </div>
      )}

      {hasCameraAccess && (
        <>
          {cameras.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Kamera választása:
                <select
                  value={selectedCamera}
                  onChange={(e) => {
                    console.log("Camera changed to:", e.target.value);
                    setSelectedCamera(e.target.value);
                  }}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  {cameras.map((camera, index) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Kamera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {!result && (
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 bg-black">
              {selectedCamera && (
                <Scanner
                  onResult={(result, error) => {
                    if (result) {
                      console.log("onResult: result received:", result);
                      handleScan(result);
                    }
                    if (error) {
                      console.log("onResult: error received:", error);
                      handleError(error);
                    }
                  }}
                  constraints={{
                    video: {
                      deviceId: selectedCamera,
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                    },
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "scaleX(-1)",
                  }}
                />
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sikeresen beolvasva!</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Felhasználó ID:</span>{" "}
              {JSON.parse(result).userId}
            </p>
            <p>
              <span className="font-medium">Generálás dátuma:</span>{" "}
              {JSON.parse(result).date}
            </p>
          </div>
          <button
            onClick={() => {
              console.log("Resetting scan result...");
              setResult(null);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Újra olvasás
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Használati útmutató:</p>
        1. Engedélyezd a kamera hozzáférését
        <br />
        2. Tartsd a kamerát a QR kód elé
        <br />
        3. Várj míg automatikusan beolvassa
      </div>
    </div>
  );
}
