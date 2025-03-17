// pages/scan-qr.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserImg, getUserOrderedFoodForDay } from "@/lib/actions/foodFetch";
import { Button } from "@/components/ui/button";

interface OrderData {
  foodId: string;
  foodName: string;
  price: number;
  quantity: number;
  totalAmount: number;
}

export default function ScanQRPage() {
  const [result, setResult] = useState<{ userId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [userImage, setUserImage] = useState<string>("");
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        setCameras(videoDevices);
        setSelectedCamera(videoDevices[0]?.deviceId || "");
        setHasCameraAccess(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        setError("Kamera hozzáférés megtagadva");
      } finally {
        setIsLoading(false);
      }
    };
    initializeCamera();
  }, []);

  const handleScan = async (detectedCodes: any[]) => {
    if (!detectedCodes?.[0]?.rawValue) return;
    // Ignore new scans if a result already exists.
    if (result) return;

    try {
      const parsedData = JSON.parse(detectedCodes[0].rawValue);
      if (!parsedData.userId) {
        setError("Érvénytelen QR kód formátum");
        return;
      }

      setLoadingData(true);
      setError(null);

      const [image, orders] = await Promise.all([
        getUserImg(parsedData.userId),
        getUserOrderedFoodForDay(parsedData.userId),
      ]);
      console.log(orders);
      setResult({ userId: parsedData.userId });
      setUserImage(image);
      setUserOrders(orders);
      setShowDialog(true);
    } catch (error) {
      setError("Hiba történt az adatok feldolgozása közben");
    } finally {
      setLoadingData(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    // Reset state so that a new QR code can be scanned
    setResult(null);
    setUserImage("");
    setUserOrders([]);
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col gap-4">
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
        <div className="flex-1 relative overflow-hidden shadow-lg">
          <Scanner
            key={selectedCamera}
            onScan={handleScan}
            constraints={{
              video: {
                deviceId: selectedCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            }}
            options={{ delay: 300 }}
            style={{
              width: "100%",
              height: "100%",
              transform: "scaleX(-1)",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {/* On mobile: full width; on larger screens: wider and centered */}
        <DialogContent className="portalColors w-full max-w-4xl h-full min-h-[80vh] mx-auto">
          <DialogHeader>
            <DialogTitle>Rendelés adatai</DialogTitle>
          </DialogHeader>
          {result && (
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              {/* Left: Orders and user info */}
              <div className="flex-1 md:w-1/3 space-y-4">
                {loadingData ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 text-lg">
                      Nincs rendelés erre a napra
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.foodId}
                        className="flex items-center justify-between p-4 rounded-lg shadow-sm border"
                      >
                        <div>
                          <h3 className="text-lg font-medium">
                            {order.foodName}
                          </h3>
                          <p>{order.price} Ft / adag</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Mennyiség:</p>
                          <p className="text-lg font-bold">{order.quantity}x</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Right: User image */}
              <div className="flex-1 md:w-full flex items-center justify-center">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Felhasználói profil"
                    className="object-cover rounded-lg w-full h-full max-w-md max-h-md"
                  />
                ) : (
                  <div className="w-full h-full max-w-md max-h-md rounded-lg bg-gray-200 border-2 border-gray-300" />
                )}
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleCloseDialog}
              className="w-1/2 h-1/2 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
              text-white font-bold rounded-lg shadow-lg transition-all duration-300
              transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
    </div>
  );
}
