"use client";

import axiosInstance from "@/lib/axios";
import { useState } from "react";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async <T>(url: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const post = async <T>(url: string, data: any): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(url, data);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const put = async <T>(url: string, data: any): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(url, data);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const del = async <T>(url: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(url);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { get, post, put, del, loading, error };
}
