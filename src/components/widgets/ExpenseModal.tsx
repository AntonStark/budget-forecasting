import React, {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";

import {ExpenseFormData, PaymentType} from "@/types";

export default function ExpenseModal(
  { onClose, onSubmit }: {onClose: () => void, onSubmit: (arg0: ExpenseFormData) => void}) {
  const ref = useRef<HTMLDivElement>();
  const [type, setType] = useState<PaymentType>("once");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  function handleSubmit() {
    const payload = {
      type,
      amount: Number(amount),
      description,
      plannedAt: (type === "monthly" ? { dayOfMonth: Number(dayOfMonth) } : { date }),
    };

    onSubmit(payload);
    onClose();
  }

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
            onClick={() => setType("once")}
            className={`flex-1 py-1 rounded-xl text-sm ${
              type === "once" ? "bg-white shadow" : "text-gray-500"
            }`}
          >Единоразовый</button>

          <button
            onClick={() => setType("monthly")}
            className={`flex-1 py-1 rounded-xl text-sm ${
              type === "monthly" ? "bg-white shadow" : "text-gray-500"
            }`}
          >Каждый месяц</button>
        </div>

        {type === "once" && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
          />
        )}

        {type === "monthly" && (
          <input
            type="number"
            placeholder="День месяца"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
          />
        )}

        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
        />

        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm"
        >Сохранить</button>
      </motion.div>
    </div>
  );
}