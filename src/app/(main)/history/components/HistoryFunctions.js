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
      ? ((currentRow.savings - prevSavings) / Math.abs(prevSavings)) * 100
      : currentRow.savings - prevSavings
    : 0;

  return { income, spending, savings };
}

export function generateCategoryObj(userHistory, setActiveCategory) {
  const categoryObj = userHistory?.reduce((acc, row) => {
    const retObj = { ...acc };

    row.categories.forEach((cat) => {
      if (!retObj[cat.category_name]) {
        retObj[cat.category_name] = [];
      }

      const categoryData = {
        date: row.month_year,
        value: cat.value,
        percentSpending: (cat.value / row.spending) * 100,
        percentIncome: (cat.value / row.income) * 100,
      };
      retObj[cat.category_name].push(categoryData);
    });

    return retObj;
  }, {});

  return categoryObj;
}

export function generateCategoryStats(
  categoryObj,
  activeCategory,
  statsPeriod
) {
  // stats to return: last 3/6/12 month avg, avg % of income, avg % of spending, category ranking among all avg spending. assume dates are already lined up
  const category = activeCategory ?? Object.keys(categoryObj)[0];
  const getAvg = (cat, duration, type) => {
    const historyRange = categoryObj[cat].slice(0, duration);
    let total = 0;
    let validRows = 0;
    for (const h of historyRange) {
      total += h[type]; // type is the key to access for the amount
      validRows += 1;
    }
    return total / validRows;
  };
  const avg3 = getAvg(category, 3, "value");
  const avg6 = getAvg(category, 6, "value");
  const avg12 = getAvg(category, 12, "value");
  const avgSpending = getAvg(category, statsPeriod, "percentSpending");
  const avgIncome = getAvg(category, statsPeriod, "percentIncome");

  const getRanking = (cat, duration) => {
    const rankingArray = Object.keys(categoryObj).reduce((acc, c) => {
      const retArr = [...acc];
      let value = 0;
      for (let i = 0; i < duration; i++) {
        if (categoryObj[c][i]) {
          value += categoryObj[c][i].value;
        }
      }

      retArr.push({ name: c, value });

      return retArr;
    }, []);

    const rankedCategories = rankingArray
      .sort((a, b) => b.value - a.value)
      .map((r, index) => ({ name: r.name, ranking: index + 1 }));

    const rank = rankedCategories.find((r) => r.name === cat).ranking;

    return { rank, maxRank: rankedCategories.length };
  };

  const { rank, maxRank } = getRanking(category, statsPeriod);

  // console.log(category, avg3, avg6, avg12, rank, maxRank, avgSpending, avgIncome);
  return { avg3, avg6, avg12, rank, maxRank, avgSpending, avgIncome };
}
