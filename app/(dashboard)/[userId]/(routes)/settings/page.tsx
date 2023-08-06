'use client';

import { Seller, User, addSeller, getUserByID } from "@/firebase/db";
import { SettingsForm } from "./components/settings-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SellerModal } from "@/components/modals/sellers-modal";

const SettingsPage = ({ params }: { params: { userId: string } }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSellerInfoProvided, setIsSellerInfoProvided] = useState(false);
  const [open, setOpen] = useState(false); // Define the 'open' state for the SellerModal

  console.log("Settings Page");
  // console.log(params.userId);

  useEffect(() => {
    const getCurrentUserData = async () => {
      console.log("fetching data in settings page");
      const data = await getUserByID(params.userId);
      return data;
    };

    getCurrentUserData()
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [params.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return (
      <div>
        <p>Could not find user with ID: {params.userId}</p>
      </div>
    )
  }

  // console.log(userData);

  const handleSellerFormSubmit = async (values: Partial<Seller>) => {
    try {
        setLoading(true);
        // Submit the seller data to your seller collection
        // Replace this with your actual implementation to submit the seller data

        // const newSeller = await addSeller(params.userId, values);
        console.log("Submitting seller data:", values);
        toast.success("Seller information saved successfully!");
        setIsSellerInfoProvided(true); // Update the state to indicate that seller information has been provided
    } catch (error) {
        toast.error("Error submitting seller information.");
        console.error("Error submitting seller information:", error);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={userData} />
        <SellerModal isOpen={open} onClose={() => setOpen(false)} onFormSubmit={handleSellerFormSubmit} sellerInfoProvided={isSellerInfoProvided} />
      </div>
    </div>
  );
};

export default SettingsPage;