/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { signature, expire, token };

  } catch (error: unknown) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: unknown) => {
    console.log(error);

    toast({
      title: 'Image uploaded failed',
      description: 'Your image could not be uploaded.',
      variant: 'destructive'
    })
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath)

    toast({
      title: 'Image uploaded successfully',
      description: `${res.filePath} uploaded sucessfully!`
    })
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />

      <button className="upload-btn" onClick={(e) => {
        e.preventDefault();

        if (ikUploadRef.current) {
          ikUploadRef.current?.click();
        }
      }}>
        <Image
          src="/icons/upload.svg"
          alt="upload"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className="text-base text-light-100">Upload a file</p>

        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        ></IKImage>
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
