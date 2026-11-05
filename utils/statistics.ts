export const calculateStatistics = (items: any[]) => {
  const totalItems = items.length;
  
  if (totalItems === 0) {
    return { totalItems: 0, averagePrice: 0, courseCounts: {} };
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = totalPrice / totalItems;

  const courseCounts = items.reduce((acc, item) => {
    acc[item.course] = (acc[item.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalItems,
    averagePrice: parseFloat(averagePrice.toFixed(2)), // rounds to 2 decimals
    courseCounts
  };
};