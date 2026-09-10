export const getElapsedYears = (startDate: Date, endDate: Date = new Date()): number => {
  let years = endDate.getFullYear() - startDate.getFullYear();

  const hasNotCompletedYear =
    endDate.getMonth() < startDate.getMonth() ||
    (endDate.getMonth() === startDate.getMonth() &&
      endDate.getDate() < startDate.getDate());

  if (hasNotCompletedYear) {
    years--;
  }

  return years;
}