import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

const Dropzone = ({
  maxFiles = 5,
  acceptOnlyImages = true,
  maxImageSizeMB = 5, // 최대 이미지 크기 (MB)
  files, setFiles
}) => {
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setErrors([]); // 에러 초기화
      const updatedFiles = [];

      for (const file of acceptedFiles) {
        if (acceptOnlyImages && !file.type.startsWith("image/")) {
          setErrors((prev) => [...prev, `${file.name}은 이미지 파일이 아닙니다.`]);
          continue;
        }

        if (file.size / 1024 / 1024 > maxImageSizeMB) {
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: maxImageSizeMB,
              useWebWorker: true,
            });
            updatedFiles.push(Object.assign(compressedFile, { preview: URL.createObjectURL(compressedFile) }));
          } catch (error) {
            setErrors((prev) => [...prev, `${file.name} 압축에 실패했습니다.`]);
          }
        } else {
          updatedFiles.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
        }
      }

      setFiles((prev) => [...prev, ...updatedFiles].slice(0, maxFiles));
    },
    [acceptOnlyImages, maxFiles, maxImageSizeMB]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptOnlyImages ? "image/*" : undefined,
    maxFiles,
  });

  return (
    <div className="max-w-md">
      <div
        {...getRootProps()}
        className={`border-dashed border-2 p-6 text-center rounded-md cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">여기에 파일을 드롭하세요...</p>
        ) : (
          <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드하세요</p>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 text-red-500">
          <p>에러:</p>
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative border rounded overflow-hidden">
              {file.type.startsWith("image/") ? (
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="
                  w-full h-full flex flex-wrap items-center justify-center 
                  bg-white text-gray-600
                  p-2
                ">
                  <div>
                    <div className="flex justify-center">
                      <InsertDriveFileIcon style={{fontSize: 50}}/>
                    </div>
                    <p className="text-center text-sm">{file.name}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
              >
                <CloseIcon style={{fontSize: 13}}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
