import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

interface Props {
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

const BreadCrumb = ({ setSelectedKey }: Props) => {
  const location = useLocation();

  // 將路徑分割成階層
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  // 生成麵包屑數據
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    // Record用法:key類型,value類型
    const breadcrumbMap: Record<string, string | JSX.Element> = {
      "/layout": <HomeOutlined onClick={() => setSelectedKey("1")} />,
      "/layout/home": "導航",
      "/layout/task": "每週任務",
      "/layout/rank": "排行榜",
      "/layout/user-info": "個人資訊",
      "/layout/car-type-setting": "車款設置",
    };

    // 最後一個項目不要用Link，才能帶出內建的黑字體
    const lastItem = index === pathSnippets.length - 1;
    return {
      key: url,
      title: lastItem ? (
        breadcrumbMap[url]
      ) : (
        <Link to={url}>{breadcrumbMap[url]}</Link>
      ),
    };
  });

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default BreadCrumb;
