"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Profile {
  id: string;
  email: string;
  userName: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/administration/user/profile");
        setProfile(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p>
          <strong>ID:</strong> {profile?.id}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>Username:</strong> {profile?.userName}
        </p>
      </div>
    </div>
  );
}
