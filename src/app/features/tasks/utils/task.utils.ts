import type { DateRange } from '../../../core/constanta/date-range-preset';
import type { Task } from '../models/task.model';

export function filterTasks(
  rows: Task[],
  range: DateRange | null,
  status: string | null,
  query = '',
): Task[] {
  const needle = query.trim().toLowerCase();
  return rows.filter((row) => {
    const inRange =
      !range ||
      (dayTime(row.createdAt) >= dayTime(range.start) &&
        dayTime(row.createdAt) <= dayTime(range.end));
    const statusMatches = !status || status === 'all' || row.status === status;
    const queryMatches =
      !needle ||
      [row.id, row.title, row.description].some((text) => text.toLowerCase().includes(needle));
    return inRange && statusMatches && queryMatches;
  });
}

function dayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
