"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

const QRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
  { ssr: false },
);

export const QrCodeGen = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      const date = new Date().toISOString().split("T")[0];
      setCurrentDate(date);
    }
  }, [isOpen]);

  const qrData = JSON.stringify({
    userId,
    date: currentDate,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <QrCode className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>
              <h4>Felhasználói QR kód generálása</h4>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="bg-main max-w-md">
        <DialogHeader>
          <DialogTitle>Felhasználói QR kód</DialogTitle>
          <DialogDescription>
            Szkenneld be a kódot a felhasználói adatok ellenőrzéséhez
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="font-medium">Felhasználó ID: {userId}</p>
            {currentDate && (
              <p className="text-sm text-muted-foreground">
                Generálva: {currentDate}
              </p>
            )}
          </div>

          <div className="p-4 bg-white rounded-lg">
            {QRCode && currentDate && (
              <QRCode value={qrData} size={256} level="H" includeMargin />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
