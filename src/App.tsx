import "./App.css";
import { Table } from "./components/table/Table";

function App() {
  return (
    <>
      <section className="container">
        <div className="tables_wrapper">
          <Table type="companies" style={{ width: "50%" }} />
          <Table type="employees" style={{ width: "45% " }} />
        </div>
      </section>
    </>
  );
}

export default App;
