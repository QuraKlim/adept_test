import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Modal } from "../../shared/components/Modal/Modal";
import { TableTypes } from "../table/Table";
import {
  AddEmployeeType,
  addEmployee,
} from "../../features/employees/employeesSlice";
import {
  AddCompanyType,
  addCompany,
} from "../../features/companies/companiesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./TableModal.module.css";
import { Button } from "../../shared/Button/Button";

interface TableModalProps {
  type: TableTypes;
  visible: boolean;
  closeModal: () => void;
}

export const TableModal = ({ type, visible, closeModal }: TableModalProps) => {
  const isCompany = type === "companies";
  const isEmployee = type === "employees";

  const emptyObjects = isCompany
    ? { name: "", address: "" }
    : {
        firstName: "",
        secondName: "",
        companyId: 0,
        jobTitle: "",
      };

  const dispatch = useAppDispatch();

  const [newEntity, setNewEntity] = useState<AddCompanyType | AddEmployeeType>(
    emptyObjects
  );

  const companies = useAppSelector((state) => state.companies.companiesList);

  const changeValue = (
    filed: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewEntity((prev) => ({
      ...prev,
      [filed]: e.target.value,
    }));
  };

  const onHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCompany) {
      dispatch(addCompany(newEntity as AddCompanyType));
    } else if (isEmployee) {
      dispatch(addEmployee(newEntity as AddEmployeeType));
    }
    setNewEntity(emptyObjects);
    closeModal();
  };

  useEffect(() => {
    const selected = companies.find((i) => i.selected);
    if (selected && isEmployee) {
      setNewEntity((prev) => ({
        ...prev,
        companyId: selected.id,
      }));
    }
  }, [companies]);

  return (
    <Modal closeModal={closeModal} visible={visible}>
      <form className={styles.form} onSubmit={onHandleSubmit}>
        <p>Добавить {isCompany ? "компанию" : " сотрудника"}</p>
        {"name" in newEntity ? (
          <>
            <input
              className={styles.input}
              required
              placeholder="Введите название компании"
              value={newEntity.name}
              onChange={(e) => changeValue("name", e)}
            />
            <input
              className={styles.input}
              required
              placeholder="Введите адрес компании"
              value={newEntity.address}
              onChange={(e) => changeValue("address", e)}
            />
          </>
        ) : (
          <>
            <input
              className={styles.input}
              value={newEntity.firstName}
              required
              placeholder="Введите имя сотрудника"
              onChange={(e) => changeValue("firstName", e)}
            />
            <input
              className={styles.input}
              value={newEntity.secondName}
              required
              placeholder="Введите фамилию сотрудника"
              onChange={(e) => changeValue("secondName", e)}
            />
            <input
              className={styles.input}
              value={newEntity.jobTitle}
              required
              placeholder="Введите должность"
              onChange={(e) => changeValue("jobTitle", e)}
            />
            <select
              className={styles.input}
              value={newEntity.companyId ?? undefined}
              required
              onChange={(e) => changeValue("companyId", e)}
            >
              {companies.map((i) => (
                <option value={i.id} key={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </>
        )}
        <Button type="submit" text="Добавить" />
      </form>
    </Modal>
  );
};
