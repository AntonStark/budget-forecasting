import {dateToSql} from "@/utils/dates";

export function parseSearchParams(searchParams: Object | null): Date {
  console.log('searchParams', searchParams)
  const dateParam = searchParams ? searchParams['date'] : undefined;
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  return initialDate;
}

export function serializeSearchParams(currentDate: Date): string {
  const params = new URLSearchParams({'date': dateToSql(currentDate)});
  return params.toString();
}