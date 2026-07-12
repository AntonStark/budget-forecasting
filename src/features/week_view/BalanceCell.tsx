import { useRef } from "react";
import {EditableCell} from "@/shared/components/EditableCell";

export default function BalanceCell ({value, inferred, onSubmit}: {
  value: number,
  inferred: boolean | undefined,
  onSubmit: (arg0: number) => void,
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const isOutsideClick = (event: MouseEvent) => Boolean(wrapperRef.current) && !wrapperRef.current.contains(event.target);

  function submitIfNeeded(val: string): boolean {
    // пустой ввод — ничего не отправляем
    if (val === '' || val === null) {
      return false;
    }

    try {
      const numericValue = Number(eval(val));

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

    catch (e) {
      console.log(e)
      return false;
    }

  }

  return (
    <div ref={wrapperRef} className={inferred? "text-gray-300" : ""}>
      <EditableCell
        inputType={"formula"}
        initialValue={String(value) || ''}
        submitIfNeeded={submitIfNeeded}
        isOutsideClick={isOutsideClick}/>
    </div>
  );
}
