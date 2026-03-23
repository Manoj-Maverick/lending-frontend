import axios from "axios";
import apiClient from "./client";

export const uploadToCloudinary = async ({
  file,
  category,
  entity_id,
  loan_id,
  onProgress,
}) => {
  let folder = "lendwid";

  if (category === "customer") {
    folder = `lendwid/customers/${entity_id}`;
  }
  if (category === "guarantor") {
    folder = `lendwid/guarantors/${entity_id}`;
  }
  if (category === "loan") {
    folder = `lendwid/loans/${loan_id}`;
  }

  const { data } = await apiClient.post("/api/cloudinary-signature", {
    folder,
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", data.api_key);
  formData.append("timestamp", data.timestamp);
  formData.append("signature", data.signature);
  formData.append("upload_preset", "lendwid_preset");
  formData.append("folder", folder);
  console.log("SENDING:", {
    timestamp: data.timestamp,
    folder,
  });
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${data.cloud_name}/auto/upload`,
    formData,
    {
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      },
    },
  );

  return res.data;
};
