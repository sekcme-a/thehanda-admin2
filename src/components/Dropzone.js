'use client'

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@mui/material";

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


//이미지만 지원
const Dropzone = ({
  maxFiles = 5,
  acceptOnlyImages = true, //아직은 이미지만 지원
  maxImageSizeMB = 5, // 최대 이미지 크기 (MB)
  files, setFiles
}) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setErrors([]); // 에러 초기화
      const updatedFiles = [];

      setLoading(true)

      for (const file of acceptedFiles) {
        if (acceptOnlyImages && !file.type.startsWith("image/")) {
          setErrors((prev) => [...prev, `${file.name}은 이미지 파일이 아닙니다.`]);
          continue;
        }

        if (file.size / 1024 / 1024 > maxImageSizeMB) {
          try {
            alert(`용량이 큰 파일을 압축하고 있습니다...
압축중인 파일: ${file.name}
파일 용량: ${(file.size /1024/1024 ).toFixed(2)}MB
최대 용량: ${maxImageSizeMB}MB
`)
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

      setLoading(false)
    },
    [acceptOnlyImages, maxFiles, maxImageSizeMB]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const moveLeft = (index) => {
    setFiles((prev) => {
      if (index === 0) return prev; // 첫 번째 파일은 더 왼쪽으로 이동 불가
      const updatedFiles = [...prev];
      // 현재 파일과 왼쪽 파일의 위치를 교환
      [updatedFiles[index - 1], updatedFiles[index]] = [updatedFiles[index], updatedFiles[index - 1]];
      return updatedFiles;
    });
  }
  const moveRight = (index) => {
    setFiles((prev) => {
      if (index === prev.length - 1) return prev; // 마지막 파일은 더 오른쪽으로 이동 불가
      const updatedFiles = [...prev];
      // 현재 파일과 오른쪽 파일의 위치를 교환
      [updatedFiles[index + 1], updatedFiles[index]] = [updatedFiles[index], updatedFiles[index + 1]];
      return updatedFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: ()=> {
      alert(`파일은 최대 ${maxFiles}개 업로드할 수 있습니다.`)
    },
    accept: acceptOnlyImages ? "image/*" : undefined,
    maxFiles,
    noClick: true,
    noKeyboard: true,
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
          <p className="text-blue-500">여기에 파일을 드롭하세요</p>
        ) : (
          <p className="text-gray-500">
            이곳으로 파일 드래그 혹은 
            <Button
              variant="text"
              onClick={open}
            >
              파일 업로드
            </Button>
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-3">
          {loading && <p>파일 업로드 중..</p>}
          {files?.map((file, index) => (
            <div key={index} className="relative border rounded overflow-hidden">
              {typeof file === "string" ? 
                <img src={file} alt={index} className="w-full h-full object-cover" />
              :
                <>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.preview} alt={file.name} 
                      className="w-full h-full object-cover max-h-32" 
                    />
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
                </>
              }
              <div
                className="absolute top-1 left-1
                flex "
              >
              <button
                onClick={() => moveLeft(index)}
                className="
                   bg-black mr-1
                text-white rounded-full 
                  w-4 h-4 flex items-center justify-center"
              >
                <ArrowCircleLeftIcon style={{fontSize: 13}}/>
              </button>
              <button
                onClick={() => moveRight(index)}
                className="
                   bg-black
                text-white rounded-full 
                  w-4 h-4 flex items-center justify-center"
              >
                <ArrowCircleRightIcon style={{fontSize: 13}}/>
              </button>
              </div>
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

    </div>
  );
};

export default Dropzone;
