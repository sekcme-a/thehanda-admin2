'use client'

import { useState, useEffect } from "react"
import DraggableList from "./DraggableList"
import styles from "./customForm.module.css"

import AddDialog from "./AddDialog"

import Dialog from '@mui/material/Dialog';

import { arrayMoveImmutable } from 'array-move';
import IconMenu from "./IconMenu";

import { v4 as uuidV4 } from "uuid"
import { Button } from "@mui/material"

const CustomForm = ({
  formData, setFormData,
  onPrevClick, onNextClick,
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const handleCloseDialog = () => { setOpenDialog(false); };
  const onAddClick = () => { setSelectedFormId("") ; setOpenDialog(true) }

  const [componentData, setComponentData] = useState([])
  const [triggerDelete, setTriggerDelete] = useState("")
  const [triggerUp, setTriggerUp] = useState("")
  const [triggerDown, setTriggerDown] = useState("")

  const [triggerCopy, setTriggerCopy] = useState("")

  const [selectedFormId, setSelectedFormId] = useState("")


  const addFormData = (data) => {
    setFormData([...formData, data])
    setComponentData([...componentData, renderComponent(data)])
  }

  const editFormData = (data) => {
    let selectedIndex = null
    const tempFormData = formData?.map((form, index) => {
      if(form.id === data.id) {
        selectedIndex = index
        return data
      }
      else return form
    })
    if(selectedIndex===null){
      alert(`편집한 폼을 찾을 수 없습니다.\nError: 101AspefCFeditFormData`)
      return
    }
    setFormData([...tempFormData])
    const tempComponentData = componentData?.map((compo, index) => {
      if(selectedIndex === index){
        return(renderComponent(data))
      } else return compo
    })
    setComponentData([...tempComponentData])
  }


  useEffect(() => {
    let temp = []
    for (let i = 0; i < formData.length; i++){
      temp.push(renderComponent(formData[i]))
    }
    setComponentData(temp)
  }, [])
  

  //폼 삭제
  useEffect(() => {
    for (let i = 0; i < formData.length; i++){
      if (triggerDelete === formData[i].id) {
        const temp = arrayMoveImmutable(formData, i, formData.length - 1)
        temp.pop()
        setFormData(temp)
        
        const temp2 = arrayMoveImmutable(componentData, i, componentData.length - 1)
        temp2.pop()
        setComponentData(temp2)
      }
    }
  },[triggerDelete])

  useEffect(()=> {
    if(triggerCopy!=="") {
      const selectedIndex = formData.findIndex(form => form.id=== triggerCopy)
      if(selectedIndex===null) {
        alert(`편집한 폼을 찾을 수 없습니다.\nError: 101AspefCFcopyForm`); return
      }
      const newUUID = uuidV4()
      const tempFormData = [...formData, {...formData[selectedIndex], id: newUUID}]
      const tempCompoData = [
        ...componentData, 
        renderComponent({...formData[selectedIndex], id: newUUID})
      ]
      console.log(tempFormData)
      setFormData(tempFormData)
      setComponentData(tempCompoData)
    }

  },[triggerCopy])

  const onMenuClick =async  (id,mode, type) => {
    if(mode==="삭제"){
      if(confirm("해당 폼을 삭제하시겠습니까?")){
        setTriggerDelete(id)
      }
    }
    else if (mode==="위로 이동"){
      setTriggerUp(id)
    }
    else if (mode==="아래로 이동"){
      setTriggerDown(id)
    }
    else if(mode==="복사"){
      console.log(id)
      setTriggerCopy(id)
    }
    else if (mode === "편집"){
      setSelectedFormId(id)
      setOpenDialog(true)
    }
  }
  useEffect(() => {
    if (triggerUp !== "") {
        const index = formData.findIndex(it=>it.id === triggerUp);
        if (index > 0) {
            const tempItems = [...formData];
            const tempComponents = [...componentData];
            // Swap the current item with the one above it
            [tempItems[index], tempItems[index - 1]] = [tempItems[index - 1], tempItems[index]];
            [tempComponents[index], tempComponents[index - 1]] = [tempComponents[index - 1], tempComponents[index]];

            setFormData(tempItems);
            setComponentData(tempComponents);
        }
        setTriggerUp(""); // Reset after the action
    }
}, [triggerUp]);

useEffect(() => {
    if (triggerDown !== "") {
      const index = formData.findIndex(it=>it.id === triggerDown);
        if (index < formData.length - 1) {
            const tempItems = [...formData];
            const tempComponents = [...componentData];
            // Swap the current item with the one below it
            [tempItems[index], tempItems[index + 1]] = [tempItems[index + 1], tempItems[index]];
            [tempComponents[index], tempComponents[index + 1]] = [tempComponents[index + 1], tempComponents[index]];

            setFormData(tempItems);
            setComponentData(tempComponents);
        }
        setTriggerDown(""); // Reset after the action
    }
}, [triggerDown]);


  const renderComponent = (data) => {
    return(
      <div className={`${styles.component_container} ${styles.single_checkbox_container}`}>
        {data.profile && <h1><strong>[프로필 데이터]</strong></h1>}
        <h1><strong>{data.typeText || "가족구성원 선택"}</strong>{data.isRequired && "(필수)"}</h1>
        <h2>제목 : {data.title}</h2>
        {data.subtitle!=="" && <h2>부가내용 : {data.subtitle}</h2>}

        {(data.text!=="" && data.text!==undefined) && data.type!=="text_area" && <h2>추가 문구 : </h2>}
        


        {typeof (data.items) === "object" && data.items.length!==0 &&
          <h3>
            옵션 :
            <ul>
              {data.items.map((item, index) => (
                <li key={index}>{`${item},`}</li>
              ))}
            </ul>
          </h3>
        }
        {data.type!=='family' &&
          <div className={styles.component_button_container} >
            <IconMenu
              handleMenuClick={(mode) => onMenuClick(data.id, mode, data.type)}
            />
          </div>
        }
      </div>
    )
  }
  

  return(
    <>
      <DraggableList 
        items={formData}
        setItems={setFormData}
        components={componentData}
        setComponents={setComponentData}
      />
      
      <div 
        className="
          w-full h-10 bg-white rounded-md
          shadow-md flex justify-center items-center
          cursor-pointer
          hover:bg-[rgb(239,239,239)]
          transition-all
        "
        onClick={onAddClick}
      >
        <p>+</p>
      </div>

      <div
        className="flex justify-between mt-6"
      >
        <Button
          variant="contained"
          size="small"
          onClick={onPrevClick}
        >
          이전
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onNextClick}
        >
          다음
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={"lg"} >
        <AddDialog 
          addFormData={addFormData} handleCloseDialog={handleCloseDialog}
          formData={formData} editFormData={editFormData} 
          contentMode={true} 
          id={selectedFormId} />
      </Dialog>
    </>
  )
}

export default CustomForm