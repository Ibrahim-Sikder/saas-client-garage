/* eslint-disable no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { countries } from "../constant/Vehicle.constant";


const useCreateSupplierMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createSupplier = async (data) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true, message: "Supplier created successfully!" });
      }, 1500);
    });
  };
  return [createSupplier, { isLoading }];
};

const useUpdateSupplierMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const updateSupplier = async ({ id, data }) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true, message: "Supplier updated successfully!" });
      }, 1500);
    });
  };
  return [updateSupplier, { isLoading }];
};

const useGetSingleSupplierQuery = ({ id, tenantDomain }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        // Mock data for editing
        setData({
          data: {
            full_name: "Acme Corp",
            contact_person_name: "John Doe",
            phone_number: "1234567890",
            country_code: "+1",
            email: "info@acmecorp.com",
            street_address: "123 Main St",
            city: "Anytown",
            country: "USA",
            state: "CA",
            postal_code: "90210",
            tax_id: "ABC123XYZ",
            bank_name: "First National Bank",
            account_number: "987654321",
            swift_code: "FNBBUS33",
            vendor: "raw_materials",
            supplier_status: "active",
            notes: "Long-standing supplier, good relationship.",
          },
        });
        setIsLoading(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tenantDomain]);
  return { data, isLoading };
};

const useTenantDomain = () => {
  // Mock tenant domain
  return "example.com";
};

const supplierValidationSchema = z.object({
  full_name: z
    .string({ required_error: "Supplier name is required." })
    .min(1, "Supplier name is required."),
  contact_person_name: z
    .string({
      required_error: "Contact person name is required.",
    })
    .min(1, "Contact person name is required."),
  phone_number: z.string().optional(),
  country_code: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  vendor: z.string().optional(), // Changed from product_type to vendor
  street_address: z.string().min(1, "Street address is required."), // Made required
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  tax_id: z.string().optional(), // Changed from vat_or_tin_number to tax_id
  registration_number: z.string().optional(),
  website: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  swift_code: z.string().optional(),
  tax_exempt: z.boolean().default(false).optional(),
  tax_exemption_number: z.string().optional(),
  credit_terms: z.boolean().default(false).optional(),
  payment_terms: z.string().optional(),
  credit_limit: z.number().optional(),
  delivery_terms: z.string().optional(),
  minimum_order_value: z.number().optional(),
  lead_time: z.number().optional(),
  shipping_method: z.string().optional(),
  supplier_status: z
    .enum(["active", "pending", "inactive"])
    .default("active")
    .optional(),
  notes: z.string().optional(),
  supplier_photo: z.string().optional(),
});

export const useSupplierForm = (id) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { tenantDomain } = useTenantDomain();

  const { data: singleSupplier, isLoading: isSingleSupplierLoading } =
    useGetSingleSupplierQuery({
      tenantDomain: tenantDomain,
      id: id || "", // Pass id as string
    });

  const [updateSupplier, { isLoading: updateLoading }] =
    useUpdateSupplierMutation();
  const [createSupplier, { isLoading: createLoading }] =
    useCreateSupplierMutation();

  const defaultSupplierValues = {
    full_name: "",
    contact_person_name: "",
    phone_number: "",
    country_code: countries[0].code,
    email: "",
    vendor: "",
    tax_id: "",
    street_address: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    bank_name: "",
    account_number: "",
    swift_code: "",
    supplier_status: "active",
    notes: "",
  };

  const methods = useForm({
    defaultValues: defaultSupplierValues,
    // resolver: zodResolver(supplierValidationSchema),
    mode: "onChange",
  });
  const { formState, reset, setValue } = methods;
  const { errors } = formState;

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    // Basic validation for numbers and length
    if (/^\d*$/.test(newPhoneNumber) && newPhoneNumber.length <= 11) {
      setPhoneNumber(newPhoneNumber);
      setValue("phone_number", newPhoneNumber, { shouldValidate: true });
    }
  };

  const formSubmit = async (data) => {
    const values = {
      ...data,
      country_code: countryCode.code,
      phone_number: phoneNumber,
    };
    try {
      const response = await createSupplier({
        ...values,
        tenantDomain,
      });
      if (response.success) {
        toast.success("Supplier created successfully!");
        navigate("/dashboard/supplier-list");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create supplier.");
    }
  };

  const onSubmit = async (data) => {
    const values = {
      ...data,
      country_code: countryCode.code,
      phone_number: phoneNumber,
    };
    try {
      const response = await updateSupplier({
        id: id,
        data: { ...values, tenantDomain },
      });
      if (response.success) {
        toast.success("Supplier updated successfully!");
        navigate("/dashboard/supplier-list");
      }
    } catch (error) {
      toast.error(
        error && error.message ? error.message : "Failed to update supplier."
      );
    }
  };

  // Update form when singleSupplier data is loaded
  useEffect(() => {
    if (id && singleSupplier?.data) {
      populateForm(singleSupplier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, singleSupplier]);

  const populateForm = (supplierData) => {
    if (!supplierData || !supplierData.data) return;
    const data = supplierData.data;
    const countryCodeObj =
      countries.find((c) => c.code === data.country_code) || countries[0];
    setCountryCode(countryCodeObj);
    setPhoneNumber(data.phone_number || "");
    reset({
      full_name: data.full_name || "",
      contact_person_name: data.contact_person_name || "",
      phone_number: data.phone_number || "",
      country_code: data.country_code || countries[0].code,
      email: data.email || "",
      vendor: data.vendor || "",
      tax_id: data.tax_id || "",
      street_address: data.street_address || "",
      country: data.country || "",
      state: data.state || "",
      city: data.city || "",
      postal_code: data.postal_code || "",
      bank_name: data.bank_name || "",
      account_number: data.account_number || "",
      swift_code: data.swift_code || "",
      supplier_status: data.supplier_status || "active",
      notes: data.notes || "",
    });
  };

  return {
    methods,
    formSubmit,
    onSubmit,
    populateForm,
    loading: isSingleSupplierLoading,
    createLoading,
    updateLoading,
    currentTab,
    setCurrentTab,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange,
    errors,
    isEditing: !!id,
  };
};
