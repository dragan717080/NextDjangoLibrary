"use client";

import type { FC } from "react";
import type { UploadInputProps } from "@/app/interfaces";

const UploadInput: FC<UploadInputProps> = ({ handleUpload }) => {
  return (
    <div>
      <label
        htmlFor="avatar"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Avatar
      </label>
      <div className="mt-2">
        <input
          type="file"
          id="avatar1"
          // To do: add 'image/webp' if switching to other service than Imgur
          accept="image/jpeg, image/png"
          onChange={(e) => handleUpload(e)}
        />
      </div>
    </div>
  );
};

export default UploadInput;
