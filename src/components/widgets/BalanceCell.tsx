import { useRef } from "react";
import {EditableCell} from "@/components/widgets/EditableCell";

export default function BalanceCell ({value, inferred, onSubmit}: {
  value: number,
  inferred: boolean,
  onSubmit: (arg0: number) => void,
}) {
  const wrapperRef = useRef(null);
  const isOutsideClick = (event: MouseEvent) => wrapperRef.current && !wrapperRef.current.contains(event.target);

  function submitIfNeeded(val: string): boolean {
    // пустой ввод — ничего не отправляем
    if (val === '' || val === null) {
      return false;
    }

    const numericValue = Number(val);

    // NaN тоже пропускаем
    if (Number.isNaN(numericValue)) {
      return false;
    }

    // если значение не изменилось — тоже можно пропустить
    if (numericValue === value) {
      return false;
    }

    onSubmit(numericValue);
    return true;
  }

  return (
    <div ref={wrapperRef} className={inferred? "text-gray-300" : ""}>
      <EditableCell
        inputType={"number"}
        initialValue={String(value) || ''}
        submitIfNeeded={submitIfNeeded}
        isOutsideClick={isOutsideClick}/>
    </div>
  );
}
