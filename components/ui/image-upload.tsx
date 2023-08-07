"use client"

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
  }
  
  const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
  }) => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);


  if (!isMounted) {
    return null;
  }

return (
    <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
            {value.map((image, index) => (
            <div
                key={index}
                className="relative flex flex-col items-center justify-center w-full h-48 bg-gray-100 rounded-md"
            >
                <Image
                src={image}
                alt="Listing image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                />
                <div className="absolute flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-25 rounded-md">
                <Button
                    onClick={() => onRemove(image)}
                    className="absolute top-0 right-0 p-2 text-white bg-black rounded-full"
                >
                    <Trash size={16} />
                </Button>
                </div>
            </div>
            ))}
        </div>
        <Button
            onClick={() => onChange('')}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-white bg-gray-900 rounded-md hover:bg-gray-800"
            disabled={disabled}
        >
            <ImagePlus size={16} />
            <span>Add image</span>
        </Button>
    </div>


)
};

export default ImageUpload;