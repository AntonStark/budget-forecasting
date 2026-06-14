import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";

import {PaymentScheduleType, PaymentType} from "@/types";
import {saveOnceOfPayment, saveScheduledPayment, updateOnceOfPayment} from "@/adapters/api";
import {usePlannerContext} from "@/components/context/PlannerProvider";

export default function ExpenseModal() {
  const { showExpenseModal, setShowExpenseModal, editingPayment, setEditingPayment } = usePlannerContext();

  const ref = useRef<HTMLDivElement>(null);
  const isEdit = !!editingPayment?.id;

  const [type, setType] = useState<PaymentType>(PaymentType.once);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [scheduleType, setScheduleType] = useState<PaymentScheduleType>(PaymentScheduleType.monthly);
  const [scheduleNumber, setScheduleNumber] = useState("");

  useEffect(() => {
    if (editingPayment) {
      setType(editingPayment.type);
      setAmount(editingPayment.amount.toString());
      setDescription(editingPayment.description);
      if (editingPayment.type === PaymentType.once) {
        setDate(editingPayment.date);
      } else if (editingPayment.type === PaymentType.regular) {
        setScheduleType(editingPayment.scheduleType);
        setScheduleNumber(editingPayment.scheduleNumber.toString());
      }
    }
  }, [editingPayment]);

  function closeModal() {
    setEditingPayment(null);
    setShowExpenseModal(false);
  }

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSubmit() {
    switch (type) {
      case PaymentType.once:
        const payload = {
          amount: Number(amount),
          description,
          plannedAt: {date}
        };
        if (editingPayment?.id) {
          await updateOnceOfPayment(payload, editingPayment?.id);
        } else {
          await saveOnceOfPayment(payload);
        }
        break;

      case PaymentType.regular:
        await saveScheduledPayment({
          amount: Number(amount),
          description,
          schedule: {type: scheduleType, number: Number(scheduleNumber)}
        });
        break;
    }

    closeModal();
  }

  const typeOption = (option: PaymentType, title: string) => {
    return (
      <button
        onClick={() => setType(option)}
        className={`flex-1 py-1 rounded-xl text-sm ${
          type === option ? "bg-white shadow" : "text-gray-500"
        }`}
      >{title}</button>
    )
  }

  const regularityOption = (option: PaymentScheduleType, title: string) => {
    return (
      <button
        onClick={() => setScheduleType(option)}
        className={`flex-1 py-1 rounded-xl text-sm ${
          scheduleType === option ? "bg-white shadow" : "text-gray-500"
        }`}
      >{title}</button>
    )
  }

  if (!showExpenseModal) {
    return null;
  }

  return (
    <div className="z-20 fixed inset-0 bg-black/10 flex items-center justify-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow p-6 w-80 space-y-4"
      >
        {!isEdit && (
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {typeOption(PaymentType.once, 'Единоразовый')}
            {typeOption(PaymentType.regular, 'Регулярный')}
          </div>
        )}

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
        >{isEdit ? "Сохранить изменения" : "Создать"}</button>
      </motion.div>
    </div>
  );
}