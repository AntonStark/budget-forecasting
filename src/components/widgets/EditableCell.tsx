import React, {useEffect, useState} from "react";

export function EditableCell({editing = undefined, initialValue, submitIfNeeded, isOutsideClick, inputType}: {
  editing?: [boolean, (arg0: boolean) => void] | undefined,
  initialValue: string,
  submitIfNeeded: (value: string) => boolean,
  isOutsideClick: (event: MouseEvent) => boolean,
  inputType: string
}) {
  const [isEditing, setIsEditing] = (editing === undefined ? useState<boolean>(false) : editing);
  const [draftValue, setDraftValue] = useState<string>('');

  useEffect(() => setDraftValue(initialValue), [initialValue]);

  useEffect(() => {
    if (!isEditing) return;

    function handleOutsideClick(event: MouseEvent) {
      if (isOutsideClick(event)) {
        _submitIfNeeded();
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isEditing, draftValue]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      _submitIfNeeded();
    }

    if (event.key === 'Escape') {
      setDraftValue('');
      setIsEditing(false);
    }

    if (inputType === "formula") {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
      ];

      const isDigit = /^\d$/.test(event.key);
      const isOperator = event.key === '+' || event.key === '-';

      if (!isDigit && !isOperator && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  function _submitIfNeeded() {
    setIsEditing(false);
    const wasSubmitted = submitIfNeeded(draftValue);
    if (wasSubmitted) {
      setDraftValue(initialValue);
    }
  }

  if (!isEditing) {
    return <div onClick={() => setIsEditing(true)}>{draftValue}</div>;
  }

  return (
    <input
      autoFocus
      type={inputType === "number" ? "number" : "text"}
      value={draftValue}
      onChange={(e) => setDraftValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className="hide-spin-buttons text-black"
      style={{width: '100%'}}
    />
  )
}
