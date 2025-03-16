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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserImg, getUserOrderedFoodForDay } from "@/lib/actions/foodFetch";
import { format } from "date-fns";

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
        <div className="flex-1 relative rounded-xl overflow-hidden border-4 border-gray-200 shadow-lg min-h-[60vh]">
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-lg font-medium">
            Keresés QR kódra...
          </div>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Felhasználói adatok</DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Felhasználói profil"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 border-2 border-gray-300" />
                )}
                <div>
                  <p className="text-lg font-semibold">
                    Felhasználó ID: {result.userId}
                  </p>
                  <p className="text-gray-600">
                    Dátum: {format(new Date(), "yyyy-MM-dd")}
                  </p>
                </div>
              </div>

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
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          {order.foodName}
                        </h3>
                        <p className="text-gray-600">{order.price} Ft / adag</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Mennyiség:</p>
                        <p className="text-lg font-bold">{order.quantity}x</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
    </div>
  );
}
