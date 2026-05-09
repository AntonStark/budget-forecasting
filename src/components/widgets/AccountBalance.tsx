import React from "react";

export default function AccountBalance ({date, accountId, value, inferred}) {
  function handleClick() {
    console.log({date, accountId, value, inferred});
  }

  return (
    <div onClick={handleClick}>{value || 0}</div>
  )
}
