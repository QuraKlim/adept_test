import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { companies } from "../../helper/companies";

export interface Company {
  name: string;
  selected: boolean;
  id: number;
  address: string;
}

export interface CompaniesState {
  companiesList: Company[];
}

const initialState: CompaniesState = {
  companiesList: companies,
};

interface IAction<T> {
  type: string;
  payload: T;
}

export type AddCompanyType = Omit<Company, "selected" | "id">;

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    addCompany: (state, action: IAction<AddCompanyType>) => {
      state.companiesList.unshift({
        ...action.payload,
        id: state.companiesList[state.companiesList.length - 1].id + 1,
        selected: false,
      });
    },
    selectCompany: (state, action: IAction<number>) => {
      const company = state.companiesList.find((i) => i.id === action.payload);
      if (company) {
        company.selected = !company?.selected;
      }
    },
    selectAllCompanies: (state, action: IAction<boolean>) => {
      state.companiesList.forEach((i) => (i.selected = action.payload));
    },
    removeCompany: (state, action: IAction<number>) => {
      state.companiesList = state.companiesList.filter(
        (i) => i.id !== action.payload
      );
    },
    removeSeveralCompany: (state) => {
      state.companiesList = state.companiesList.filter((i) => !i.selected);
    },
    changeCompanyInfo: (
      state,
      action: IAction<{ id: number; field: "name" | "address"; value: string }>
    ) => {
      const company = state.companiesList.find(
        (i) => i.id === action.payload.id
      );
      if (company) {
        company[action.payload.field] = action.payload.value;
      }
    },
  },
});

export const {
  selectCompany,
  selectAllCompanies,
  removeCompany,
  removeSeveralCompany,
  changeCompanyInfo,
  addCompany,
} = companiesSlice.actions;

export default companiesSlice.reducer;
