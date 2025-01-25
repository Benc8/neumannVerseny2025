"use client";

import React from "react";
import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { Button } from "@/components/ui/button";
import { ImageUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${config.env.apiEndpoint.apiEndpoint}/api/auth/imagekit`,
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    const { token, expire, signature } = data;
    return { signature, expire, token };
  } catch (error) {
    console.log(error);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = React.useRef(null);
  const [file, setFile] = React.useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.log("Error", error);
    toast({
      title: "Hiba a képfeltöltés során",
      description: "A kép feltöltése sikertelen",
      variant: "destructive",
    });
  };
  const onSuccess = (response: any) => {
    setFile(response);
    onFileChange(response.filePath);
    toast({
      title: "Sikeres képfeltöltés",
      description: "A kép sikeresen feltöltődött",
    });
  };

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
      // @ts-ignore
      authenticator={authenticator}
    >
      <IKUpload
        className={"hidden"}
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="file"
      />
      <div className="flex items-center justify-center">
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (ikUploadRef.current) {
              // @ts-ignore
              ikUploadRef.current?.click();
            }
          }}
          className={
            "block w-full lg:w-1/2 py-3 px-4 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800\n" +
            "             text-white font-bold rounded-lg shadow-lg transition-all duration-300\n" +
            "             transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          }
        >
          <ImageUp className={"inline"} />
        </Button>
      </div>

      {file && (
        <div className={"flex items-center justify-center"}>
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={300}
            height={300}
            className={"inline-block rounded-xl"}
          />
        </div>
      )}
    </ImageKitProvider>
  );
};
export default ImageUpload;
