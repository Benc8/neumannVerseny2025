// components/ProfileImageDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePenLine } from "lucide-react";
import { updateUserImage } from "@/lib/actions/foodFetch";

export const ProfileImageDialog = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = async (imageUrl: string) => {
    try {
      await updateUserImage(userId, imageUrl);
      toast({
        title: "Kép frissítve!",
        description: "A felhasználói képed sikeresen frissült",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A képfrissítés sikertelen",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FilePenLine />
            </TooltipTrigger>
            <TooltipContent>
              <h4>
                Állíts be felhasználóképet, hogy a fiókodat el tudják fogadni!
              </h4>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="portalColors">
        <DialogHeader>
          <DialogTitle>Fénykép beállítása</DialogTitle>
          <DialogDescription>
            Állíts be egy megfelelő felhasználóképet, hogy a fiókodat el tudják
            fogadni!
          </DialogDescription>
          <ImageUpload onFileChange={handleImageUpload} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
