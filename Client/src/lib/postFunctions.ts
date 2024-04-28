export function getStockMovementPercentage(
  priceAtGuess: number,
  currentPrice?: number
) {
  if (!currentPrice) return;

  // temp variables
  const atGuess = priceAtGuess;
  const current = currentPrice;

  // Calculate how much the stock price has moved since the guess and return the percentage appended to the post
  const movement = ((current - atGuess) / atGuess) * 100;

  console.log('movement', movement > 0);
  return movement;
}

export function calculateDaysLeft(finalDate: string, guesDate: string) {
  console.log('finalDate', finalDate);
  console.log('guesDate', guesDate);
  const dateAtFinal = new Date(finalDate);
  const dateAtGuess = new Date(guesDate);
  const difference = dateAtFinal.getTime() - dateAtGuess.getTime();
  const daysLeft = difference / (1000 * 3600 * 24);
  return daysLeft;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' });

  const suffix =
    ['st', 'nd', 'rd'][(((Number(day) % 30) + 90) % 30) - 1] || 'th';

  return `${day}${suffix} ${month}, ${year}`;
}

export function calculateAccuracy(
  predictedMovement: number,
  priceAtGuess: number,
  currentPrice?: number
) {
  if (!currentPrice) return;

  const actualMovement = ((currentPrice - priceAtGuess) / priceAtGuess) * 100;

  let accuracy = 0;
  // If the predicted and actual movement have opposite signs, return 0% accuracy.
  if (
    (predictedMovement < 0 && actualMovement > 0) ||
    (predictedMovement > 0 && actualMovement < 0)
  ) {
    accuracy = 0;
  }
  // If predicted movement is greater than or equal to the actual movement, use the first formula
  else if (Math.abs(predictedMovement) >= Math.abs(actualMovement)) {
    accuracy = (Math.abs(actualMovement) / Math.abs(predictedMovement)) * 100;
  }
  // If predicted movement is less than the actual movement, use the second formula
  else {
    accuracy = (Math.abs(predictedMovement) / Math.abs(actualMovement)) * 100;
  }

  // append accuracy to post

  return accuracy;
}
