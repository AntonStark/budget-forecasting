export default function HeaderTools({ goToday, onAdd }) {
  const modes = [
    { key: "week", label: "Неделя" },
    { key: "month", label: "Месяц" },
  ];

  return (
    <>
      <button
        onClick={goToday}
        className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
      >Today</button>

      <button
          onClick={onAdd}
          className="text-sm px-3 py-1.5 rounded-lg bg-black text-white hover:opacity-90 transition"
        >+</button>
    </>
  );
}
