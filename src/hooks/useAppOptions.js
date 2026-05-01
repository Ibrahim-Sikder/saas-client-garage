/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { usePermissions } from "../context/PermissionContext";
import { useTenantDomain } from "./useTenantDomain";

// ===== API Imports =====
import {
    useCreateProductMutation,
    useGetAllIProductQuery,
    useUpdateProductMutation,
} from "../redux/api/productApi";

import { useCreateBarcodeMutation } from "../redux/api/barcodeApi";
import { useGetAllWarrantyQuery } from "../redux/api/warrantyApi";
import { useGetAllWarehousesQuery } from "../redux/api/warehouseApi";
import { useGetAllSuppliersQuery, useCreateSupplierMutation, useUpdateSupplierMutation } from "../redux/api/supplier";
import { useGetAllIProductTypeQuery } from "../redux/api/productTypeApi";
import { useGetAllIUnitQuery } from "../redux/api/unitApi";
import { useGetAllIBrandQuery } from "../redux/api/brandApi";
import { useGetAllICategoryQuery } from "../redux/api/categoryApi";
import { useGetAllInvoicesQuery } from "../redux/api/invoice";
import { useGetAllUserQuery } from "../redux/api/userApi";
import { useGetAllPagesQuery } from "../redux/api/pageApi";
import { useGetAllRolesQuery } from "../redux/api/roleApi";

export function useAppOptions(limit = 10, initialSearch = "") {
    const [currentPage, setCurrentPage] = useState(1);
    const { tenantDomain } = useTenantDomain();
    const [filterType, setFilterType] = useState("");
    const { performActionWithPermission } = usePermissions();
    // ===== Mutations =====
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [createBarcode] = useCreateBarcodeMutation();

    const [createSupplier, { isLoading: createSupplierLoading }] =
        useCreateSupplierMutation();
    const [updateSupplier, { isLoading: updateSupplierLoading }] =
        useUpdateSupplierMutation();


    // ===== Queries =====
    const { data: userData } = useGetAllUserQuery({ tenantDomain });
    const { data: pageData } = useGetAllPagesQuery({ tenantDomain })
    const { data: roleData } = useGetAllRolesQuery({ tenantDomain })
    const { data: productData } = useGetAllIProductQuery({
        tenantDomain,
        limit,
        page: currentPage,
        searchTerm: initialSearch,
    });


    const { data: categoryData } = useGetAllICategoryQuery({
        tenantDomain,
        limit: 99999999999,
        page: 1,
        searchTerm: "",
    });

    const { data: brandData, isLoading: brandLoading } = useGetAllIBrandQuery({
        tenantDomain,
        limit: 99999999999,
        page: 1,
        searchTerm: "",
    });

    const { data: unitData, isLoading: unitLoading } = useGetAllIUnitQuery({
        tenantDomain,
        limit: 99999999999,
        page: 1,
        searchTerm: "",
    });

    const { data: productTypeData, isLoading: productTypeLoading } = useGetAllIProductTypeQuery({
        tenantDomain,
        limit: 99999999999,
        page: 1,
        searchTerm: "",
    });

    const { data: supplierData, isLoading: supplierLoading } = useGetAllSuppliersQuery({
        tenantDomain,
        limit: 1000000,
        page: 1,
        searchTerm: "",
    });

    const { data: warehouseData, isLoading: warehouseLoading } = useGetAllWarehousesQuery({
        tenantDomain,
        limit: 1000000,
        page: 1,
        searchTerm: "",
    });

    const { data: warrantyData } = useGetAllWarrantyQuery({
        tenantDomain,
        limit: 1000000,
        page: 1,
        searchTerm: "",
    });

    const { data: allInvoices } = useGetAllInvoicesQuery({
        tenantDomain,
        limit,
        page: currentPage,
        searchTerm: filterType,
        isRecycled: false,
    });





    // ===== Dropdown Options =====
    const roleOptions = useMemo(() => {
        if (!allInvoices?.data?.invoices) return [];
        return allInvoices.data.invoices.map((invoice) => ({
            label: `${invoice.invoice_no} - ${invoice.Id}`,
            _id: invoice._id,
            invoiceData: invoice,
        }));
    }, [allInvoices?.data?.invoices]);




    const invoiceOption = useMemo(() => {
        if (!allInvoices?.data?.invoices) return [];
        return allInvoices.data.invoices.map((invoice) => ({
            label: `${invoice.invoice_no} - ${invoice.Id}`,
            _id: invoice._id,
            invoiceData: invoice,
        }));
    }, [allInvoices?.data?.invoices]);

    const categoryOptions = useMemo(() => {
        return categoryData?.data?.categories?.map((item) => ({
            label: item.main_category,
            value: item._id,
        })) || [];
    }, [categoryData]);

    const brandOptions = useMemo(() => {
        return brandData?.data?.brands?.map((item) => ({
            label: item.brand,
            value: item._id,
        })) || [];
    }, [brandData]);

    const unitOptions = useMemo(() => {
        return unitData?.data?.units?.map((item) => ({
            label: item.unit,
            value: item._id,
        })) || [];
    }, [unitData]);

    const productTypeOptions = useMemo(() => {
        return productTypeData?.data?.productTypes?.map((item) => ({
            label: item.product_type,
            value: item._id,
        })) || [];
    }, [productTypeData]);

    const supplierOptions = useMemo(() => {
        return supplierData?.data?.suppliers?.map((item) => ({
            label: item.full_name,
            value: item._id,
        })) || [];
    }, [supplierData]);

    const warehouseOptions = useMemo(() => {
        return warehouseData?.data?.warehouses?.map((item) => ({
            label: item.name,
            value: item._id,
        })) || [];
    }, [warehouseData]);

    const warrantyOptions = useMemo(() => {
        return warrantyData?.data?.data?.map((item) => ({
            label: item.name,
            value: item._id,
        })) || [];
    }, [warrantyData]);

    const productOptions = useMemo(() => {
        if (!productData?.data?.products) return [];
        return productData.data.products.map((product) => ({
            label: product.product_name,
            value: product._id,
            product,
        }));
    }, [productData?.data?.products]);

    // ===== Return All Exports =====
    return {
        // Options
        productOptions,
        categoryOptions,
        brandOptions,
        unitOptions,
        productTypeOptions,
        supplierOptions,
        warehouseOptions,
        warrantyOptions,
        invoiceOption,

        // Data
        allInvoices,
        productData,
        categoryData,
        brandData,
        unitData,
        productTypeData,
        supplierData,
        warehouseData,
        warrantyData,
        userData,
        roleData, pageData,

        // Mutations
        createProduct,
        updateProduct,
        createSupplier,
        updateSupplier,
        createBarcode,

        // Loading states
        updateSupplierLoading,
        createSupplierLoading,

        // Utilities
        performActionWithPermission,
        tenantDomain,
        currentPage,
        setCurrentPage,
        //loading
        supplierLoading,
        warehouseLoading,
        brandLoading,
        unitLoading
    };
}
