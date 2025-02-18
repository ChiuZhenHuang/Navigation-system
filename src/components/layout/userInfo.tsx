import { useState } from "react";
import { Row, Col } from "antd";
import UserImage from "@/assets/images/frog.jpg";
import ChangeImage from "./changeImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import type { ActionResponse } from "@/types/recordType";

import { useEffect } from "react";
import { useGetUserRecord } from "@/hooks/useGetUserRecord";
import { getCookie } from "@/utils/getCookie";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const [avatarUrl, setAvatarUrl] = useState(UserImage);

  const userName = useSelector((state: RootState) => state.user.userName);
  const record = useSelector((state: RootState) => state.record.totalRecord);

  const [userId, setUserId] = useState("");
  const { fetchUserRecord } = useGetUserRecord();
  const navigate = useNavigate();

  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    const retrievedToken = getCookie("token") ?? "";
    setUserId(retrievedUid);

    if (!retrievedToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserRecord(userId);
  }, [userId]);

  // 這一頁要再重新抓取api資訊
  return (
    <>
      <Row justify="center" align="middle" className="m-4">
        <Col
          xs={24}
          sm={8}
          className="flex justify-center items-center sm:justify-start"
        >
          <div className="relative w-40 min-w-[115px] min-h-[115px] border-4 border-white">
            <img
              src={avatarUrl}
              alt="UserImage"
              className="object-cover w-full h-full"
            />
          </div>
        </Col>
        <Col xs={24} sm={16} className="flex justify-center items-center">
          <div className="w-full">
            <div className="flex justify-center mt-2">
              <p className="font-bold">{userName}</p>
            </div>
            <div className="flex flex-col justify-center items-center mt-2 sm:flex-row">
              <ChangeImage setAvatarUrl={setAvatarUrl}>
                <Button type="primary" ghost className="m-1">
                  編輯頭像
                </Button>
              </ChangeImage>
            </div>
          </div>
        </Col>

        <Col xs={24} className="flex justify-center items-center">
          <div className="w-full mt-4 flex-1 max-h-[60vh]">
            {record.length > 0 ? (
              <div>
                <p className="my-2 flex text-center justify-center rounded-lg border border-slate-500 w-[80px] bg-[#FFE3BA]">
                  導航紀錄
                </p>
                {record.map((v: ActionResponse, index) => {
                  const { place, distance, carType, oil } = v.action;
                  return (
                    <Card key={index} className="my-1" title={place}>
                      <p>距離：{distance}m</p>
                      <p>使用車種：{carType}</p>
                      <p>預估油錢：NT${Number(distance) * Number(oil)}</p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div>您尚未有導航紀錄！</div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default UserInfo;
