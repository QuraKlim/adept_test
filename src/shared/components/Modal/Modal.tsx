import { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  visible: boolean;
  closeModal: () => void;
}

export const Modal = ({ children, visible, closeModal }: ModalProps) => {
  return (
    <>
      {visible && (
        <div className={styles.modal_wrapper}>
          <div className="container">
            <div className={styles.modal}>
              <div className={styles.close} onClick={closeModal}>
                &#10060;
              </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
