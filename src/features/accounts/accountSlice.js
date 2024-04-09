// initial state, reducer, action creators
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
const URL = "api.frankfurter.app/latest";
export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };

    case "account/withdraw":
      if (action.payload > state.balance) return state;
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };

    case "account/payLoan":
      if (state.loan === 0 || state.balance < state.loan) return state;
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
        loanPurpose: "",
      };

    case "convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
}

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  // change amount
  return async function (dispatch, getState) {
    dispatch({ type: "convertingCurrency" });
    try {
      const res = await fetch(
        `https://${URL}?amount=${amount}&from=${currency}&to=USD`
      );
      if (!res.ok) throw new Error("Error in currency conversion");

      const data = await res.json();
      if (!data) throw new Error("Error in currency conversion");
      const converted = data.rates.USD;

      return dispatch({ type: "account/deposit", payload: converted });
    } catch (err) {
      console.error(err.message);
    }
  };
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}
