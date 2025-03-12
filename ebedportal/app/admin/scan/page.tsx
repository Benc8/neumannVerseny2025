// pages/scan-qr.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ScanQRPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        if (videoDevices.length === 0) {
          setError("Nem található kamera eszköz");
          return;
        }

        setCameras(videoDevices);
        setSelectedCamera(videoDevices[0].deviceId);
        setHasCameraAccess(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        setError(
          "Kamera hozzáférés megtagadva. Engedélyezze a kamera használatát!",
        );
      } finally {
        setIsLoading(false);
      }
    };
    initializeCamera();
  }, []);

  const handleScan = (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const firstCode = detectedCodes[0];
    if (!firstCode?.rawValue) return;

    try {
      const parsedData = JSON.parse(firstCode.rawValue);
      if (parsedData.userId && parsedData.date) {
        setResult(firstCode.rawValue);
        setError(null);
        setShowAlert(true);
      } else {
        setError("Érvénytelen QR kód formátum");
      }
    } catch (e) {
      setError("Nem sikerült értelmezni a QR kódot");
    }
  };

  const handleError = (err: any) => {
    setError(`QR olvasási hiba: ${err?.message || "Ismeretlen hiba"}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result || "");
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col gap-4">
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sikeresen beolvasva!</DialogTitle>
            <DialogDescription>A QR kód tartalma:</DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-2 p-4 bg-gray-100 rounded-md">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(JSON.parse(result), null, 2)}
              </pre>
            </div>
          )}

          <DialogFooter>
            <Button onClick={copyToClipboard}>Másolás vágólapra</Button>
            <Button onClick={() => setShowAlert(false)}>Bezárás</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-2xl font-bold">QR kód olvasó</h1>

      <Link href="/" className="text-blue-600 hover:underline w-fit">
        Vissza a főoldalra
      </Link>

      {isLoading && (
        <div className="text-center py-4">Kamera inicializálása...</div>
      )}

      {!isLoading && !hasCameraAccess && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error || "A kamera nem elérhető"}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Újrapróbálkozás
          </button>
        </div>
      )}

      {hasCameraAccess && (
        <>
          {cameras.length > 1 && (
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium mb-2">
                Kamera választása:
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md bg-white"
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

          {!showAlert && (
            <div className="flex-1 relative rounded-xl overflow-hidden border-4 border-gray-200 shadow-lg min-h-[60vh]">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-lg font-medium">
                Keresés QR kódra...
              </div>

              <Scanner
                key={selectedCamera}
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  video: {
                    deviceId: selectedCamera,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                  },
                }}
                options={{
                  delay: 300,
                  constraints: {
                    facingMode: "environment",
                  },
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  transform: "scaleX(-1)",
                  objectFit: "cover",
                }}
                containerStyle={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  minHeight: "400px",
                }}
                videoStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="text-sm text-gray-600">
        <p>Használati útmutató:</p>
        <ol className="list-decimal list-inside">
          <li>Engedélyezd a kamera hozzáférését</li>
          <li>Tartsd a kamerát a QR kód elé</li>
          <li>Várj míg automatikusan beolvassa</li>
        </ol>
      </div>
    </div>
  );
}
