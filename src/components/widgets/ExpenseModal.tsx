import React, {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";

export default function ExpenseModal({ onClose }) {
  const ref = useRef<HTMLDivElement>();
  const [type, setType] = useState("one");

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow p-6 w-80 space-y-4"
      >
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setType("one")}
            className={`flex-1 py-1 rounded-xl text-sm ${
              type === "one" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Единоразовый
          </button>
          <button
            onClick={() => setType("monthly")}
            className={`flex-1 py-1 rounded-xl text-sm ${
              type === "monthly" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Каждый месяц
          </button>
        </div>

        <input
          type="number"
          placeholder="Сумма"
          className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
        />

        {type === "monthly" && (
          <input
            type="number"
            placeholder="День месяца"
            className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
          />
        )}

        <input
          type="text"
          placeholder="Описание"
          className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
        />
      </motion.div>
    </div>
  );
}