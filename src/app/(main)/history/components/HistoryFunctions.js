export function generateComparativePeriod(
  currentRow,
  filteredHistory,
  comparePeriod,
  showPercents
) {
  let prevIncome = 0;
  let prevSpending = 0;
  let prevSavings = 0;

  let validRows = 0;

  for (let i = 1; i <= comparePeriod; i++) {
    const row = filteredHistory[currentRow.index + i];
    if (row) {
      validRows += 1;
      prevIncome += row.income;
      prevSpending += row.spending;
      prevSavings += row.income - row.spending;
    }
  }

  prevIncome = validRows ? prevIncome / validRows : prevIncome;
  prevSpending = validRows ? prevSpending / validRows : prevSpending;
  prevSavings = validRows ? prevSavings / validRows : prevSavings;

  const income = validRows
    ? showPercents
      ? ((currentRow.income - prevIncome) / prevIncome) * 100
      : currentRow.income - prevIncome
    : 0;
  const spending = validRows
    ? showPercents
      ? ((currentRow.spending - prevSpending) / prevSpending) * 100
      : currentRow.spending - prevSpending
    : 0;
  const savings = validRows
    ? showPercents
      ? ((currentRow.savings - prevSavings) / prevSavings) * 100
      : currentRow.savings - prevSavings
    : 0;

  return { income, spending, savings };
}
