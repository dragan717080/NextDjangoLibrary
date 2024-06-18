import type { ChangeEvent } from "react";

export default interface UploadInputProps {
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}
