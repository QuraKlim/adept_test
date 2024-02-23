import { employees } from "./../helper/employees";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import companiesReducer from "../features/companies/companiesSlice";
import employeesReducer from "../features/employees/employeesSlice";

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    employees: employeesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
