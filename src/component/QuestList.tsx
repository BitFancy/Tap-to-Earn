import { Link } from "react-router-dom";
import { mockQuest } from "../mock";
export default function QuestList() {
  return (
    <div className="max-h-[75vh] max-sm:max-h-[70vh] overflow-auto">
      {mockQuest.map((data, index) => (
        <Link
          key={index}
          to={data.link}
          className={`flex items-center h-28 max-sm:h-24 px-5 max-sm:px-3 py-2 my-4 mx-2 max-sm:mx-1 bg-[#363636] rounded-lg hover:opacity-80 active:scale-95 text-white transition ease-in-out`}
        >
          <img src={data.icon} alt={"icon-" + index} className="w-12 h-12 mr-5" />
          <div className="flex items-center justify-start text-lg">
            {data.description}
          </div>
        </Link>
      ))}
    </div>
  );
}
