
import ExpenseForm from './ExpenseForm';

const UpdateExpense = () => {
    const id = new URLSearchParams(location.search).get("id");
  return <ExpenseForm id={id}/>
};

export default UpdateExpense;