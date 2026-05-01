import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatDate } from "../utils/formateDate";
import {
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
} from "../redux/api/income";
import { useTenantDomain } from "./useTenantDomain";

export const defaultIncomeValues = {
  date: new Date(),
  invoice_number: "",
  customer: "",
  income_source: "",
  amount: 0,
  payment_method: "",
  reference_number: "",
  description: "",
};

export const useIncomeForm = (id) => {
  const navigate = useNavigate();
  const { tenantDomain } = useTenantDomain();
  const [createIncome, { isLoading: createLoading }] =
    useCreateIncomeMutation();
  const [updateIncome, { isLoading: updateLoading }] =
    useUpdateIncomeMutation();

  const methods = useForm({
    defaultValues: defaultIncomeValues,
  });

  const { reset } = methods;

  // Process form data for submission
  const processFormData = (data) => {
    return {
      ...data,
      date: formatDate(data.date),
      amount: Number(data.amount),
    };
  };

  // Create new income
  const formSubmit = async (data) => {
    const processedData = processFormData(data);
    try {
      const response = await createIncome({
        tenantDomain,
        ...processedData,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        navigate("/dashboard/income-list");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  // Update existing income
  const onSubmit = async (data) => {
    const processedData = processFormData(data);
    try {
      const response = await updateIncome({
        tenantDomain,
        id,
        ...processedData,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        navigate("/dashboard/income-list");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  // Populate form with existing data
  const populateForm = (incomeData) => {
    if (!incomeData) return;
    const data = incomeData?.data;

    // Parse date string to Date object
    const dateValue = data?.date ? new Date(data?.date) : new Date();

    reset({
      date: dateValue,
      invoice_number: data?.invoice_number || "",
      customer: data?.customer || "",
      income_source: data?.income_source || "",
      amount: Number(data?.amount) || 0,
      payment_method: data?.payment_method || "",
      reference_number: data?.reference_number || "",
      description: data?.description || "",
    });
  };

  return {
    methods,
    formSubmit,
    onSubmit,
    populateForm,
    createLoading,
    updateLoading,
  };
};
