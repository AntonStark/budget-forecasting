
export default async function WeekByNumberPage({
  params
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params;

  return (<span data-number={number}>{number}</span>)
}
