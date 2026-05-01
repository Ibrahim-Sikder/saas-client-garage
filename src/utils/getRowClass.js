// utils/getRowClass.ts
export function getRowClass(card) {
  const remaining = card.moneyReceipts?.[0]?.remaining;
  const totalAmount = card.moneyReceipts?.[0]?.total_amount;
  const advance = card.moneyReceipts?.[0]?.advance;
  const advance2 = Number(card?.advance) || 0;

  // Convert net_total string with commas to number
  const netTotalNum = Number(String(card.net_total).replace(/,/g, ""));

  if (card.moneyReceipts.length === 0) {
    return "bg-[#f5365c] text-white";
  } else if (advance2 === netTotalNum) {
    return "bg-[#2dce89] text-white";
  } else if (remaining === 0 && advance === 0 && totalAmount === 0) {
    return "bg-[#f5365c] text-white";
  } else if (advance === totalAmount) {
    return "bg-[#2dce89] text-white";
  } else if (advance !== totalAmount) {
    return "bg-[#ffad46] text-white";
  } else {
    return "bg-[#f5365c] text-black";
  }
}
