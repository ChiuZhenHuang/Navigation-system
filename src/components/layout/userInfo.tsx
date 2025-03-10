import { useEffect } from "react";
import { Row, Col } from "antd";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import type { ActionResponse } from "@/types/recordType";
import { getCookie } from "@/utils/method";
import { useNavigate } from "react-router-dom";
import { formatToThousand, calculateOilMoney } from "@/utils/method";
import Avatar from "@/components/ui/avatar";
import { useAppSelector } from "@/stores/reduxHook";

const UserInfo = () => {
  const firsrName = useAppSelector((state) => state.user.firstName);
  const userName = useAppSelector((state) => state.user.userName);
  const record = useAppSelector((state) => state.record.totalRecord);

  const navigate = useNavigate();

  useEffect(() => {
    const retrievedToken = getCookie("token") ?? "";
    if (!retrievedToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Row justify="center" align="middle" className="m-4">
        <Col xs={24} sm={8} className="flex justify-center items-center">
          <Avatar size={100} className="border-4 border-white">
            <div className=" text-4xl">{firsrName}</div>
          </Avatar>
        </Col>
        <Col xs={24} sm={16} className="flex justify-center items-center">
          <div className="w-full">
            <div className="flex justify-center mt-2">
              <p className="font-bold text-2xl">{userName}</p>
            </div>
          </div>
        </Col>
        <Col xs={24} className="flex justify-center items-center">
          <div className="w-full mt-4 flex-1 max-h-[60vh]">
            <div className="h-[2px] mb-4 bg-slate-200 w-full"></div>
            <p className="my-2 py-1 text-base flex text-center justify-center rounded-lg border-2 border-white w-[100px] text-white bg-[#A1754D]">
              導航紀錄
            </p>
            {record.length > 0 ? (
              <div>
                {record.map((v: ActionResponse, index) => {
                  const { place, distance, carType, oil, time } = v.action;
                  const { timestamp } = v;
                  const date = new Date(timestamp);
                  const spiltDistance = distance.split(" 公里");

                  return (
                    <Card key={index} className="my-1" title={place}>
                      <p>距離：{distance}</p>
                      <p>花費時間：{time}</p>
                      <p>使用車種：{carType}</p>
                      <p>
                        預估油費：NT$
                        {formatToThousand(
                          calculateOilMoney(spiltDistance[0], oil).toFixed(0)
                        )}
                        元
                      </p>
                      <p className="text-slate-500 text-xs">
                        {date.toLocaleString()}
                      </p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div>您尚未有導航紀錄！</div>
                <Button
                  className="bg-orange-100 my-2 w-full sm:w-40"
                  onClick={() => navigate("/layout/home")}
                >
                  開始導航
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default UserInfo;
