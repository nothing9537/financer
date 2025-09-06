import { eachDayOfInterval, isSameDay } from 'date-fns';

export function fillMissingDays(
  activeDays: { date: Date, income: number, expenses: number }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    return found || { date: day, income: 0, expenses: 0 };
  });

  return transactionsByDay;
}