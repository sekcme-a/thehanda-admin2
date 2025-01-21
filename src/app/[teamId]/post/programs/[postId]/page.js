'use client';

import Header from "@/app/[teamId]/components/Header";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Stepper from "./components/Stepper";
import EditContent from "./components/editContent/EditContent";
import CustomForm from "./components/customForm/CustomForm";
import PublishSetting from "./components/publishSetting/PublishSetting";
import { useEffect } from "react";
import { fetchPost } from "./service/handlePost";
import FullScreenLoader from "@/components/FullScreenLoader";

const EditPost = () => {
  const {teamId, postId} = useParams()
  const router = useRouter()
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)

  const [postValues, setPostValues] = useState({
    isMain: false,
    type: "common",
    condition: "unpublished",
    title: "",
    subtitle: "",
    dateText: "",
    tags: "",
    images: [],
    welcome: "",
    info: [],
    quickLink: [],
    formData: [],
    
    hasReserve: false, //예약게재 여부
    startAt: new Date(),
    hasDeadline: false,
    endAt: new Date(),

    hasProgramStart: false,
    programStartAt: new Date(),
    autoConfirm: false,
    hasLimit: false,
    limitCount: 0,
    // hasSchedule: false,
    // history: [],
  });

  useEffect(()=> {
    if(postId && teamId && postId!=="new"){
      fetchData()
    }
  },[])

  const fetchData = async () => {
    try{
      setLoading(true)
      const data = await fetchPost(teamId, postId)
      setPostValues({
        ...data.program_post_data,
        hasReserve: data.program_reserve_start_at ? true : false,
        startAt: new Date(data.program_reserve_start_at),
        hasProgramStart: data.program_apply_start_at ? true: false,
        programStartAt: new Date(data.program_apply_start_at),
        endAt: new Date(data.deadline),
      })
      setLoading(false)
    }catch(e){
      console.log(e)
      alert("해당 게시물을 불러올 수 없습니다.")
      router.back()
    }
  }


  const handleFormData = (data) => {
    setPostValues((prev) => ({
      ...prev,
      formData: [...data],
    }));
  };



  // 서버 렌더링 방지
  if (typeof window === "undefined") return null;

  if(loading) return <FullScreenLoader />

  return (
    <>
      <Header title="프로그램 편집" />
      <div className="p-5">
        <div className="hidden md:block">
          <Stepper
            step={step}
            handleStep={(num) => setStep(num)}
            data={["게시물 작성", "폼 작성", "저장 및 게재"]}
          />
        </div>
        <div className="bg-white rounded-lg px-5 py-6 mt-5 shadow">
          {step === 0 && (
            <EditContent
              {...{ postValues, setPostValues }}
              onNextClick={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <CustomForm
              formData={postValues.formData}
              setFormData={handleFormData}
              onPrevClick={() => setStep(0)}
              onNextClick={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PublishSetting
              {...{postValues, setPostValues}}
              onPrevClick={()=>setStep(1)}
              // onSaveClick={onSaveClick}
              // onPublishClick={onPublishClick}
              // onUnpublishClick={onUnpublishClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditPost;
