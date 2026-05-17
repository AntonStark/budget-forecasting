import { useEffect, useRef, useState } from "react";

export default function BalanceCell ({
  value,
  inferred,
  editable = true,
  onSubmit,
}: {
  value: number,
  inferred: boolean,
  editable: boolean,
  onSubmit: (arg0: number) => void,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setDraftValue(value ?? '');
  }, [value]);

  useEffect(() => {
    if (!isEditing) return;

    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        submitIfNeeded();
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isEditing, draftValue]);

  function handleClick() {
    if (!editable) {
      return;
    }

    setIsEditing(true);
  }

  function submitIfNeeded() {
    setIsEditing(false);

    // пустой ввод — ничего не отправляем
    if (draftValue === '' || draftValue === null) {
      return;
    }

    const numericValue = Number(draftValue);

    // NaN тоже пропускаем
    if (Number.isNaN(numericValue)) {
      return;
    }

    // если значение не изменилось — тоже можно пропустить
    if (numericValue === value) {
      return;
    }

    onSubmit(numericValue);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      submitIfNeeded();
    }

    if (event.key === 'Escape') {
      setDraftValue(value ?? '');
      setIsEditing(false);
    }
  }

  return (
    <div ref={wrapperRef}>
      {isEditing ? (
        <input
          autoFocus
          type="number"
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="hide-spin-buttons"
          style={{width: '100%'}}
        />
      ) : (
        <div
          onClick={handleClick}
          className={inferred? "text-gray-300" : ""}
        >{value}</div>
      )}
    </div>
  );
}
