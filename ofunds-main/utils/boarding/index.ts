export const clearOnBoardingLocal = () => {
  localStorage.removeItem("isDoneProfile");
  localStorage.removeItem("isDoneLocation");
  localStorage.removeItem("isDoneWithdrawal");
  localStorage.removeItem("isDoneCurrency");
};
