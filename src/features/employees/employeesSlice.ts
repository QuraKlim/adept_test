import { createSlice, nanoid } from "@reduxjs/toolkit";
import { employees } from "../../helper/employees";
import { Company } from "../companies/companiesSlice";

export interface Employee {
  firstName: string;
  secondName: string;
  jobTitle: string;
  selected: boolean;
  id: number;
  companyId: number;
}

export interface EmployeesState {
  employeesList: Employee[];
}

const initialState: EmployeesState = {
  employeesList: employees,
};

interface IAction<T> {
  type: string;
  payload: T;
}

export type AddEmployeeType = Omit<Employee, "selected" | "id">;

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action: IAction<AddEmployeeType>) => {
      state.employeesList.unshift({
        ...action.payload,
        companyId: +action.payload.companyId,
        id: state.employeesList.length
          ? state.employeesList[state.employeesList.length - 1].id + 1
          : 1,
        selected: false,
      });
    },
    selectEmployee: (state, action: IAction<number>) => {
      const employee = state.employeesList.find((i) => i.id === action.payload);
      if (employee) {
        employee.selected = !employee?.selected;
      }
    },
    selectAllEmployees: (state, action: IAction<boolean>) => {
      state.employeesList.forEach((i) => (i.selected = action.payload));
    },
    removeEmployee: (state, action: IAction<number>) => {
      state.employeesList = state.employeesList.filter(
        (i) => i.id !== action.payload
      );
    },
    removeEmployeesByCompanyId: (state, action: IAction<number>) => {
      state.employeesList = state.employeesList.filter(
        (i) => i.companyId !== action.payload
      );
    },
    removeEmployeesByCompaniesId: (state, action: IAction<Company[]>) => {
      state.employeesList = state.employeesList.filter(
        (i) => !action.payload.find((l) => l.id == i.companyId && l.selected)
      );
    },
    removeSeveralEmployees: (state) => {
      state.employeesList = state.employeesList.filter((i) => !i.selected);
    },
    changeEmployeeInfo: (
      state,
      action: IAction<{
        id: number;
        field: "firstName" | "jobTitle" | "secondName";
        value: string;
      }>
    ) => {
      const employee = state.employeesList.find(
        (i) => i.id === action.payload.id
      );
      if (employee) {
        employee[action.payload.field] = action.payload.value;
      }
    },
  },
});

export const {
  selectEmployee,
  selectAllEmployees,
  removeEmployee,
  removeSeveralEmployees,
  changeEmployeeInfo,
  removeEmployeesByCompanyId,
  removeEmployeesByCompaniesId,
  addEmployee,
} = employeesSlice.actions;

export default employeesSlice.reducer;
