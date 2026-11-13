import { createContext, useContext } from "react";

export const CalculatorResultsContext = createContext(null);

export function useCalculatorResults() {
  const context = useContext(CalculatorResultsContext);

  if (!context) {
    throw new Error(
      "useCalculatorResults must be used within CalculatorResultsContext.Provider."
    );
  }

  return context;
}
