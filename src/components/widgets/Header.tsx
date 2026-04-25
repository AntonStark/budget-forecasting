import { motion } from "framer-motion";

import {usePlannerContext} from "@/components/context/PlannerContext";
import ModeSwitcher from "@/components/widgets/ModeSwitcher";
import {formatMonth, formatWeek} from "@/utils/dates";

export default function Header({ onAdd }) {
  const { mode, setMode, next, prev, currentDate } = usePlannerContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={prev}>←</button>

        <span>
          {mode === "week" ? formatWeek(currentDate) : formatMonth(currentDate)}
        </span>

        <button onClick={next}>→</button>
      </div>

      <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
        <ModeSwitcher mode={mode} setMode={setMode} onAdd={onAdd}/>
      </motion.div>
    </div>
  );
}
