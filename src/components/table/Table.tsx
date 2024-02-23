import React, {
  ChangeEvent,
  Fragment,
  MouseEvent,
  useEffect,
  useState,
} from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectCompany,
  selectAllCompanies,
  removeCompany,
  changeCompanyInfo,
  removeSeveralCompany,
} from "../../features/companies/companiesSlice";
import {
  selectEmployee,
  selectAllEmployees,
  removeEmployee,
  removeSeveralEmployees,
  changeEmployeeInfo,
  removeEmployeesByCompanyId,
  removeEmployeesByCompaniesId,
} from "../../features/employees/employeesSlice";
import styles from "./Table.module.css";
import TrashIcon from "../../shared/icons/trash.svg";
import { TableModal } from "../modal/TableModal";

export type TableTypes = "employees" | "companies";

export interface TableProps {
  type: TableTypes;
  style?: Record<string, string | number>;
}

export const Table = ({ type, style }: TableProps) => {
  const [employeesByCompanyId, setEmployeesByCompanyId] = useState<
    Record<number, number>
  >({});
  const [listLength, setListLength] = useState(10);
  const [modalOpened, setModalOpened] = useState(false);

  const closeModal = () => {
    setModalOpened(false);
  };

  const isCompany = type === "companies";
  const isEmployees = type === "employees";

  const dispatch = useAppDispatch();

  const employeesList = useAppSelector(
    (state) => state.employees.employeesList
  );

  const companiesList = useAppSelector(
    (state) => state.companies.companiesList
  );

  const list = isCompany
    ? companiesList
    : employeesList.filter((i) =>
        companiesList.find((m) => m.id === i.companyId && m.selected)
      );

  const onCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (isCompany) {
      dispatch(selectAllCompanies(e.target.checked));
    } else if (isEmployees) {
      dispatch(selectAllEmployees(e.target.checked));
    }
  };

  const deleteSeveral = (e: MouseEvent) => {
    e.preventDefault();
    if (isCompany) {
      dispatch(removeEmployeesByCompaniesId(companiesList));
      dispatch(removeSeveralCompany());
    } else if (isEmployees) {
      dispatch(removeSeveralEmployees());
    }
  };

  useEffect(() => {
    if (isCompany) {
      const employees: Record<number, number> = {};
      employeesList.forEach((i) => {
        employees[i.companyId] = employees[i.companyId]
          ? employees[i.companyId] + 1
          : 1;
      });
      setEmployeesByCompanyId(employees);
    }
  }, [employeesList]);

  return (
    <>
      {(companiesList.some((i) => i.selected) && isEmployees) || isCompany ? (
        <div
          onScroll={(e) => {
            if (
              e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
              e.currentTarget.scrollHeight
            ) {
              setListLength((prev) => prev + 10);
            }
          }}
          className={styles.table}
          style={style}
        >
          <div className={styles.table_header}>
            <div className={styles.choose_all}>
              <input type="checkbox" onChange={onCheckAll} />
              <p>Выделить всё</p>
            </div>
            {list.some((i) => i.selected) && (
              <button onClick={deleteSeveral} className={styles.button}>
                Удалить выбранное
              </button>
            )}
          </div>
          <table className={styles.table_content}>
            {isCompany && (
              <thead>
                <tr>
                  <th></th>
                  <th>Компания</th>
                  <th>Количество сотрудников</th>
                  <th>Адрес</th>
                  <th></th>
                </tr>
              </thead>
            )}
            {isEmployees && (
              <thead>
                <tr>
                  <th></th>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Должность</th>
                  <th></th>
                </tr>
              </thead>
            )}
            {list.slice(0, listLength).map((i) => (
              <tr key={i.id} className={i.selected ? styles.choosen_row : ""}>
                <td>
                  <input
                    className={styles.check}
                    type="checkbox"
                    checked={i.selected}
                    onChange={() => {
                      if (isCompany) {
                        dispatch(selectCompany(i.id));
                      } else if (isEmployees) {
                        dispatch(selectEmployee(i.id));
                      }
                    }}
                  />
                </td>
                {"name" in i && (
                  <>
                    <td>
                      <p
                        contentEditable
                        onBlur={(e) => {
                          const event: React.FormEvent<HTMLParagraphElement> =
                            e;
                          dispatch(
                            changeCompanyInfo({
                              id: i.id,
                              field: "name",
                              value: event.currentTarget.innerText,
                            })
                          );
                        }}
                      >
                        {i.name}
                      </p>
                    </td>
                    <td>
                      <p>Сотрудников: {employeesByCompanyId[i.id] ?? 0}</p>
                    </td>
                    <td>
                      <p
                        contentEditable
                        onBlur={(e) => {
                          dispatch(
                            changeCompanyInfo({
                              id: i.id,
                              field: "address",
                              value: e.currentTarget.innerText,
                            })
                          );
                        }}
                      >
                        {i.address}
                      </p>
                    </td>
                  </>
                )}
                {"firstName" in i && (
                  <>
                    <td>
                      <p
                        contentEditable
                        onBlur={(e) => {
                          const event: React.FormEvent<HTMLParagraphElement> =
                            e;
                          dispatch(
                            changeEmployeeInfo({
                              id: i.id,
                              field: "firstName",
                              value: event.currentTarget.innerText,
                            })
                          );
                        }}
                      >
                        {i.firstName}
                      </p>
                    </td>
                    <td>
                      <p
                        contentEditable
                        onBlur={(e) => {
                          dispatch(
                            changeEmployeeInfo({
                              id: i.id,
                              field: "secondName",
                              value: e.currentTarget.innerText,
                            })
                          );
                        }}
                      >
                        {i.secondName}
                      </p>
                    </td>

                    <td>
                      <p
                        contentEditable
                        onBlur={(e) => {
                          dispatch(
                            changeEmployeeInfo({
                              id: i.id,
                              field: "jobTitle",
                              value: e.currentTarget.innerText,
                            })
                          );
                        }}
                      >
                        {i.jobTitle}
                      </p>
                    </td>
                  </>
                )}
                <td>
                  <img
                    onClick={() => {
                      if (isCompany) {
                        dispatch(removeCompany(i.id));
                        dispatch(removeEmployeesByCompanyId(i.id));
                      } else if (isEmployees) {
                        dispatch(removeEmployee(i.id));
                      }
                    }}
                    src={TrashIcon}
                    alt="trash"
                    className={styles.trash}
                  />
                </td>
              </tr>
            ))}
            <tfoot>
              <td colSpan={5}>
                <button
                  className={styles.button}
                  onClick={() => setModalOpened(true)}
                >
                  {isCompany ? "Добавить компанию" : "Добавить сотрудника"}
                </button>
              </td>
            </tfoot>
          </table>
        </div>
      ) : null}
      <TableModal closeModal={closeModal} type={type} visible={modalOpened} />
    </>
  );
};
