/* eslint-disable react/prop-types */
import { createContext, useRef } from 'react'
import { usePDF } from 'react-to-pdf';
import { useReactToPrint } from 'react-to-print';

export const PrintContext = createContext()

const PrintProvider = ({ children }) => {
    const componentRef = useRef();
    const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    const authInfo = {
        handlePrint,
        toPDF,
        targetRef,
        componentRef
    }

    return (
        <PrintContext.Provider value={authInfo}>{children}</PrintContext.Provider>
    )
}

export default PrintProvider
