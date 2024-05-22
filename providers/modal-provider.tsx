"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

/**
 * Provides a modal component for the application.
 * Renders the StoreModal component when mounted so not cause an hydration mismatch error.
 */
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};




  // Check to see is the client is hydrated... In the case where the component is rendered on the server and is not hydrated on client,
  // it will return null so not to cause a hydration mismatch error.