import {motion} from "framer-motion";

import {usePlannerContext} from "@/components/context/PlannerProvider";

import {formatMonth, formatWeek, getWeek} from "@/utils/dates";
import {Mode} from "@/types";

export default function Header({ onAdd, onLog }) {
  const { mode, setMode, currentDate, next, prev, setCurrentDate } = usePlannerContext();

  const goToday = () => setCurrentDate(new Date());

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-4 py-3">
      {/* LEFT: navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 transition"
        >←</button>

        <div className="text-sm font-medium min-w-[140px] text-center">
          {mode === Mode.week ? formatWeek(getWeek(currentDate)) : formatMonth(currentDate)}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 transition"
        >→</button>
      </div>

      {/* CENTER: segmented control */}
      <div className="relative flex bg-gray-100 rounded-xl py-1">
        <SegmentButton active={mode === Mode.week} onClick={() => setMode(Mode.week)}>
          Week
        </SegmentButton>
        <SegmentButton active={mode === Mode.month} onClick={() => setMode(Mode.month)}>
          Month
        </SegmentButton>

        <motion.div
          layout
          className="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm"
          animate={{ x: mode === Mode.week ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* RIGHT: actions */}
      <div className="flex items-center gap-2">
        <HeaderTools goToday={goToday} onAdd={onAdd} onLog={onLog}/>
      </div>

    </div>
  );
}


function SegmentButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative z-10 px-4 py-1.5 text-sm rounded-lg transition ${
        active ? "text-black" : "text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}


function HeaderTools({ goToday, onAdd, onLog }) {
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

      <button
          onClick={onLog}
          className="text-sm px-3 py-1.5 rounded-lg bg-black text-white hover:opacity-90 transition"
        >/</button>
    </>
  );
}
