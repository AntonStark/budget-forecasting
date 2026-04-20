export default function ModeSwitcher({ mode, setMode }) {
  const modes = [
    { key: "week", label: "Неделя" },
    { key: "month", label: "Месяц" },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`px-4 py-2 rounded-2xl text-sm transition ${
            mode === m.key
              ? "bg-white shadow text-gray-900"
              : "text-gray-500"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
