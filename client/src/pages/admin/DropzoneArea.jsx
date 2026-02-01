import React from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";

const DropzoneArea = ({ onDrop, files = [] }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 ${isDragActive ? "border-[#D6A419] bg-yellow-50 dark:bg-yellow-900/10" : "border-gray-300 dark:border-gray-600 hover:border-blue-500"}`}
    >
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div className="text-green-600 dark:text-green-400 font-medium flex flex-col items-center">
          <ImageIcon size={32} className="mb-2" />
          {files.length} image{files.length > 1 ? "s" : ""} selected
          <span className="text-xs text-gray-500 mt-1">
            {files.map((f) => f.name).join(", ")}
          </span>
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
          <Upload size={32} className="mb-2" />
          <span className="text-sm font-medium">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop some files here, or click to select files"}
          </span>
          <span className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</span>
        </div>
      )}
    </div>
  );
};

export default DropzoneArea;
