import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { Route, withRouter } from "react-router-dom";
import {
  TotalContainer,
  UploadDropZone,
  RightContainer,
  TitleInputBar,
  AdvertisementComponent,
  AtmosphereComponent,
  LocationComponent,
  RatingComponent,
} from "./UploadStyled";
import Dropzone from "./UploadFunction/Dropzone";
import TitleName from "./UploadFunction/TitleName";
import Advertisement from "./UploadFunction/advertisement";
import Atmosphere from "./UploadFunction/Atmosphere";
import Rating from "./UploadFunction/Rating";
import Address from "./UploadFunction/Address";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import StickMap from "./UploadFunction/StickMap";

const useStyles = makeStyles((theme) => ({
  DropZoneArea: {
    height: "100%",
    border: "4px dashed #979797",
    boxSizing: "border-box",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto 0",
    backgroundColor: "#404040",
  },
  DropzoneParagrap: {
    fontFamily: "Noto Sans KR",
    fontStyle: "normal",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
  colorq: {
    display: "flex",
    marginTop: "50px",
  },
}));

const UploadPage = (props) => {
  //유저 정보
  const [userId, setUserId] = useState();
  //유저 상태
  const isLogin = useSelector((store) => store.isLogin);
  //주소
  const [address, setAddress] = useState();
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const classes = useStyles();

  const [mood, setMood] = useState(props.mood ? props.mood : ""); //분위기
  const [board, setBoard] = useState({
    btitle: "",
    bcontent: "",
    bimage: "",
  });
  const [image, setImage] = useState();
  const onDrop = async (file) => {
    setImage("");
    setBoard((prevState) => {
      return {
        ...prevState,
        [file[0].name]: file[0],
      };
    });
    console.log(board);
    setImage(file[0]);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const changeValue = (e) => {
    setBoard((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onHandleUpload = (e) => {
    board.bimage = image;
    console.log(board);
    console.log("위도", location.latitude);
    console.log("경도", location.longitude);
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", board.btitle);
    formData.append("content", board.bcontent);
    formData.append("image", board.bimage);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    if (
      board.bimage === "" || //이미지업로드 X
      board.btitle === "" || //제목이(x)
      board.bcontent === "" || //상세내용x
      location.latitude === "" || //지도 좌표x
      location.longitude === ""
    ) {
      alert("업로드내용을 입력해주세요");
    } else {
      //업로드 fetch , bimage, btitle, bcontent
      fetch("http://localhost:8000/board/save", {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        body: formData,
      })
        .then((res) => res.text())
        .then((res) => {
          if (res === "ok") {
            alert("업로드 완료");
            window.location.reload();
          } else {
            alert("업로드 실패");
          }
        });
      props.close();
    }
  };

  return (
    <Dialog
      scroll={"body"}
      maxWidth={false}
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: {
          backgroundColor: "rgba(64, 64, 64, 0.7)",
          backdropFilter: "blur(30px)",
          borderRadius: "20px",
          color: "#ffffff",
        },
      }}
    >
      <form>
        <TotalContainer style={{ paddingTop: "30px" }}>
          <UploadDropZone>
            <div
              style={{
                height: "100%",
              }}
            >
              <DropzoneArea
                onDrop={onDrop}
                dropzoneClass={classes.DropZoneArea}
                dropzoneParagraphClass={classes.DropzoneParagrap}
                Icon=""
                dropzoneText={
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={image ? URL.createObjectURL(image) : null}
                      alt={image ? image.name : null}
                    />
                  </div>
                }
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                showPreviews={true}
                showPreviewsInDropzone={true}
                useChipsForPreview //사진이 아니라 이름으로 보여주기 위함
                previewText="Selected files"
                filesLimit={1} //파일 갯수
              />
            </div>
          </UploadDropZone>
          <RightContainer>
            <TitleInputBar>
              <form style={{ width: "100%", height: "100%" }}>
                <Input
                  placeholder="제목"
                  name="btitle"
                  onChange={changeValue}
                  style={{ width: "100%", height: "11%", color: "#ffffff" }}
                />
                <TextField
                  style={{
                    color: "#FFFF00",
                    width: "100%",
                    marginTop: "21px",
                    borderRadius: "10px",
                    boxSizing: "border-box",
                    border: "2px solid #979797",
                  }}
                  color="secondary"
                  id="outlined-multiline-static"
                  name="bcontent"
                  multiline
                  rows={17}
                  placeholder="리뷰 적기..."
                  variant="outlined"
                  onChange={changeValue}
                />
              </form>
            </TitleInputBar>
            <AdvertisementComponent>
              <Advertisement />
            </AdvertisementComponent>
            <AtmosphereComponent>
              <Atmosphere />
            </AtmosphereComponent>
            <LocationComponent>
              <Address
                location={location}
                setLocation={setLocation}
                address={address}
                setAddress={setAddress}
              />
            </LocationComponent>
            <div
              style={{
                marginTop: "-20px",
                background: "white",
                maxWidth: "510px",
                overflow: "auto",
                maxHeight: "140px",
              }}
            ></div>
          </RightContainer>
          <ClearTwoToneIcon
            fontSize="large"
            style={{
              cursor: "pointer",
              marginTop: "-20px",
              marginRight: "-15px",
            }}
            onClick={() => props.close()}
          />
        </TotalContainer>
        <div
          style={{
            width: "100%",
            height: "121px",
          }}
        >
          <Button
            style={{
              border: "none",
              width: "140px",
              height: "70px",
              background: "#ff534b",
              borderRadius: "35px",
              fontFamily: "Noto Sans KR",
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "35px",
              lineHeight: "51px",
              alignItems: "center",
              textAlign: "center",
              color: "#ffffff",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={onHandleUpload}
          >
            완료
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default UploadPage;
