import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";

import {OncePaymentData, PaymentScheduleType, PaymentType, ScheduledPaymentData} from "@/types";

export default function ExpenseModal({ onClose, onSubmitOnce, onSubmitScheduled }: {
  onClose: () => void,
  onSubmitOnce: (arg0: OncePaymentData) => void,
  onSubmitScheduled: (arg0: ScheduledPaymentData) => void
}) {
  const ref = useRef<HTMLDivElement>();
  const [type, setType] = useState<PaymentType>(PaymentType.once);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleType, setScheduleType] = useState<PaymentScheduleType>(PaymentScheduleType.monthly)
  const [scheduleNumber, setScheduleNumber] = useState("");
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
    switch (type) {
      case PaymentType.once:
        onSubmitOnce({
          amount: Number(amount),
          description,
          plannedAt: {date}
        });
        break;
      case PaymentType.regular:
        onSubmitScheduled({
          amount: Number(amount),
          description,
          schedule: {type: scheduleType, number: Number(scheduleNumber)}
        });
        break;
    }

    onClose();
  }

  const typeOption = (option, title) => {
    return (
      <button
        onClick={() => setType(option)}
        className={`flex-1 py-1 rounded-xl text-sm ${
          type === option ? "bg-white shadow" : "text-gray-500"
        }`}
      >{title}</button>
    )
  }

  const regularityOption = (option, title) => {
    return (
      <button
        onClick={() => setScheduleType(option)}
        className={`flex-1 py-1 rounded-xl text-sm ${
          scheduleType === option ? "bg-white shadow" : "text-gray-500"
        }`}
      >{title}</button>
    )
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
          {typeOption(PaymentType.once, 'Единоразовый')}
          {typeOption(PaymentType.regular, 'Регулярный')}
        </div>

        {type === PaymentType.once && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none"
          />
        )}

        {type === PaymentType.regular && (
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {regularityOption(PaymentScheduleType.monthly, 'Ежемесячный')}
            {regularityOption(PaymentScheduleType.weekly, 'Еженедельный')}
          </div>
        )}

        {type === PaymentType.regular && (
          <input
            type="number"
            placeholder={scheduleType === PaymentScheduleType.monthly ? "Число месяца" : "День недели 1..7"}
            value={scheduleNumber}
            onChange={(e) => setScheduleNumber(e.target.value)}
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