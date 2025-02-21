import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-50 w-screen h-screen flex flex-col justify-center items-center">
      <div className="text-xl text-orange-700 font-bold py-4">404NotFound</div>
      <div className="text-xl text-orange-700 font-bold pb-6">找不到此頁面</div>
      <Button
        className="w-[100px] bg-orange-300 hover:bg-orange-200"
        onClick={() => navigate("/login")}
      >
        回首頁
      </Button>
    </div>
  );
};

export default NotFound;
