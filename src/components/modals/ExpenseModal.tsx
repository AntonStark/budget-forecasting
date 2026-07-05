import {motion} from "framer-motion";
import { Calendar } from "lucide-react";
import React, {useEffect, useRef, useState} from "react";

import {PaymentCategorySchema, PaymentScheduleType, PaymentType} from "@/types";
import {fetchPaymentCategories, saveOnceOfPayment, saveScheduledPayment, updateOnceOfPayment} from "@/app/actions";
import {usePlannerContext} from "@/components/context/PlannerProvider";
import {dateToSql} from "@/utils/dates";

export default function ExpenseModal() {
  const { currentDate, showExpenseModal, setShowExpenseModal, editingPayment, setEditingPayment } = usePlannerContext();

  const ref = useRef<HTMLDivElement>(null);
  const isEdit = !!editingPayment?.id;

  const [availableCategories, setAvailableCategories] = useState<PaymentCategorySchema[]>([]);
  const [type, setType] = useState<PaymentType>(PaymentType.once);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [date, setDate] = useState("");
  const [scheduleType, setScheduleType] = useState<PaymentScheduleType>(PaymentScheduleType.monthly);
  const [scheduleNumber, setScheduleNumber] = useState("");

  useEffect(() => {
    if (editingPayment) {
      setType(editingPayment.type);
      setAmount(editingPayment.amount.toString());
      setDescription(editingPayment.description);
      setCategoryId(editingPayment.category?.id || 0);
      if (editingPayment.type === PaymentType.once) {
        setDate(editingPayment.date);
      } else if (editingPayment.type === PaymentType.regular) {
        setScheduleType(editingPayment.scheduleType);
        setScheduleNumber(editingPayment.scheduleNumber.toString());
      }
    }
  }, [editingPayment]);
  useEffect(() => {
    setDate(dateToSql(currentDate));
  }, [currentDate]);
  useEffect(() => {
    fetchPaymentCategories().then(setAvailableCategories);
  }, []);

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
          plannedAt: {date},
          category: {id: categoryId}
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
          <div className="flex gap-2 items-start">
            <DateInputSeparated date={date} setDate={setDate}/>
          </div>
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

        <div className="flex gap-2 items-start w-full p-2 rounded-xl bg-gray-50 text-sm outline-none">
          <label className="text-gray-500">Категория:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            style={{width: '90px'}}
          >
            <option value={0}></option>
            {availableCategories.map(cat => (
              <option value={cat.id} label={cat.name} key={cat.id}/>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm"
        >{isEdit ? "Сохранить изменения" : "Создать"}</button>
      </motion.div>
    </div>
  );
}


function DateInputSeparated({ date, setDate }) {
  const dateRef = useRef<HTMLInputElement>(null);

  const [year, month, day] = date.split("-");
  function updateDateParts({
    newYear = year,
    newMonth = month,
    newDay = day,
  }: {
    newYear?: string;
    newMonth?: string;
    newDay?: string;
  }) {
    setDate(`${newYear.padStart(4, "0")}-${newMonth.padStart(2, "0")}-${newDay.padStart(2, "0")}`);
  }

  return (
    <>
      <input
        type="number"
        min={1}
        max={31}
        value={Number(day)}
        onChange={(e) => updateDateParts({ newDay: e.target.value })}
        className="w-16 p-2 rounded-xl bg-gray-50 text-sm"
      />

      <select
        value={month}
        onChange={(e) => updateDateParts({ newMonth: e.target.value })}
        className="p-2 rounded-xl bg-gray-50 text-sm"
      >
        <option value="01">Янв</option>
        <option value="02">Фев</option>
        <option value="03">Мар</option>
        <option value="04">Апр</option>
        <option value="05">Май</option>
        <option value="06">Июн</option>
        <option value="07">Июл</option>
        <option value="08">Авг</option>
        <option value="09">Сен</option>
        <option value="10">Окт</option>
        <option value="11">Ноя</option>
        <option value="12">Дек</option>
      </select>

      <input
        type="number"
        value={Number(year)}
        onChange={(e) => updateDateParts({ newYear: e.target.value })}
        className="w-20 p-2 rounded-xl bg-gray-50 text-sm"
      />

      <button type="button" className="p-2 self-center" onClick={() => dateRef.current?.showPicker()}>
        <Calendar size={18}/>
      </button>

      <input
        ref={dateRef}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="absolute opacity-0 pointer-events-none"
      />
    </>
  )
}