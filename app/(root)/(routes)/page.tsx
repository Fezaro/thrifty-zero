"use client";
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { use, useEffect } from 'react';
import { useStoreModal } from '@/hooks/use-store-modal';


const HomePage= ()=> {
  // set modal to open on page load
  const onOpen =  useStoreModal((state) => state.onOpen);

  // check if modal is open
  const isOpen =  useStoreModal((state) => state.isOpen);

  // set modal to open on page load
  useEffect(() => {
    if (!isOpen) {
      onOpen();

    }
  }, [isOpen, onOpen]);



  return null;
    
}

export default HomePage;