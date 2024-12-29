import React from "react";
import { TextField, Button } from "@mui/material";
import { Grid2 } from "@mui/material";
import { arrayMoveImmutable } from "array-move";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const InfoInput = ({ 
  id = "info", postValues, setPostValues,
  title="",
  label1="", label2="",
  placeholder1="", placeholder2="",
  addButtonText=""
}) => {
  const onInfoChange = (index, type, value) => {
    const updatedInfo = postValues[id]?.map((item, i) =>
      i === index ? { ...item, [type]: value } : item
    );
    setPostValues((prevValues) => ({ ...prevValues, [id]: updatedInfo }));
  };

  const onAddInfoClick = () => {
    setPostValues((prevValues) => ({
      ...prevValues,
      [id]: [...(prevValues[id] || []), { title: "", text: "" }],
    }));
  };

  const onDeleteInfoClick = (index) => {
    const updatedInfo = postValues[id]?.filter((_, i) => i !== index);
    setPostValues((prevValues) => ({ ...prevValues, [id]: updatedInfo }));
  };

  const onUpClick = (index) => {
    if (index > 0) {
      const updatedInfo = arrayMoveImmutable(postValues[id], index, index - 1);
      setPostValues((prevValues) => ({ ...prevValues, [id]: updatedInfo }));
    }
  };

  const onDownClick = (index) => {
    if (index < postValues[id]?.length - 1) {
      const updatedInfo = arrayMoveImmutable(postValues[id], index, index + 1);
      setPostValues((prevValues) => ({ ...prevValues, [id]: updatedInfo }));
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h1 className="font-bold">{title}</h1>
      <div className="space-y-6">
        {postValues[id]?.map((item, index) => (
          <Grid2 container spacing={2} key={index} className="items-start">
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField
                value={item.title}
                size="small"
                placeholder={placeholder1}
                label={label1}
                fullWidth
                onChange={(e) => onInfoChange(index, "title", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <TextField
                value={item.text}
                size="small"
                label={label2}
                placeholder={placeholder2}
                fullWidth
                multiline
                onChange={(e) => onInfoChange(index, "text", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 1 }}>
              <Grid2 container rowSpacing={1} columnSpacing={1}>
                <Grid2 size={{ xs: 4, md: 12 }}>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => onDeleteInfoClick(index)}
                    fullWidth
                  >
                    삭제
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 4, md: 12 }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => onUpClick(index)}
                    fullWidth
                  >
                    <KeyboardArrowUpRoundedIcon fontSize="small" />
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 4, md: 12 }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => onDownClick(index)}
                    fullWidth
                  >
                    <KeyboardArrowDownRoundedIcon fontSize="small" />
                  </Button>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        ))}
        <Button
          variant="text"
          size="small"
          onClick={onAddInfoClick}
          fullWidth
        >
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

export default InfoInput;
