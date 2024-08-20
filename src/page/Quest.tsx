import QuestList from "../component/QuestList";

export default function Quest() {
  return (
    <div className="max-w-[500px] mx-auto">
      <h1 className="text-3xl mb-3 mx-auto text-start">Quests</h1>
      <QuestList />
    </div>
  );
}
