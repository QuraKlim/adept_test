import styles from "./Button.module.css";

interface ButtonProps {
  type: "submit" | "button";
  text: string;
}

export const Button = ({ type = "button", text }: ButtonProps) => {
  return (
    <button className={styles.button} type={type}>
      {text}
    </button>
  );
};
