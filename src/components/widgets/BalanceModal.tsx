import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Account = {
  id: string;
  title: string;
};

interface BalanceFormData {
  date: string
  balances: { accountId: string, value: number}[]
}

const ACCOUNTS: Account[] = [
  { id: "1", title: "сбер" },
  { id: "2", title: "наличка" },
  { id: "3", title: "альфа" },
  { id: "4", title: "озон" },
];

export default function BalanceModal({onClose, onSubmit}: {
  onClose: () => void;
  onSubmit: (data: BalanceFormData) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  function handleChange(accountId: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [accountId]: Number(value),
    }));
  }

  function handleSubmit() {
    const payload = {
      date,
      balances: []
    }
    for (let accountId in values) {
      payload.balances.push({accountId, value: values[accountId]});
    }

    onSubmit(payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/10 flex z-10 items-center justify-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow p-6 w-80 space-y-4"
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
        />

        <div className="space-y-3">
          {ACCOUNTS.map((acc) => (
            <div key={acc.id} className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">{acc.title}</span>
              <input
                type="number"
                placeholder="0"
                value={values[acc.id] || ""}
                onChange={(e) => handleChange(acc.id, e.target.value)}
                className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm"
        >
          Сохранить
        </button>
      </motion.div>
    </div>
  );
}