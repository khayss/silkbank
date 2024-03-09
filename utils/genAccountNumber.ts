export const genAccountNumber = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers.sort(() => 0.5 - Math.random());
  return numbers.join("");
};
