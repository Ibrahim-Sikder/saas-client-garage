/* eslint-disable react/prop-types */
import { FaWhatsapp } from "react-icons/fa";
const Message = ({ data }) => {
  const whatsappNum = data?.whatsappNumber
    ? data?.whatsappNumber.toString()
    : `${data?.customer_country_code}${data?.customer_contact}`.replace(
      /\D/g,
      ""
    );
  const whatsappUrl = `https://wa.me/${whatsappNum}`;
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between cursor-pointer md:w-[500px] mx-auto my-20">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shadow-lg bg-[#24CC63] text-white p-3 rounded-lg"
      >
        <FaWhatsapp size={100} />
      </a>
    </div>
  );
};

export default Message;
