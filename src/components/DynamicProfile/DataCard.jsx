/* eslint-disable react/prop-types */
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiOutlineEye } from "react-icons/hi";
import Card from "../Card/Card";
import { formatValue } from "./FormatedValue";

const DataCard = ({

    cardConfig,
    recentItems,
    onVehicleDetailsOpen
}) => {
    const hasData = recentItems.some(item => item !== null);

    if (!hasData) {
        return (
            <Card>
                <h3 className="text-xl flex items-center justify-center h-full font-bold">
                    No {cardConfig.title} found!
                </h3>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] md:text-xl font-semibold">
                    {cardConfig.title}
                </h3>
                {cardConfig.editIcon && (
                    <Link to={cardConfig.createLink}>
                        <FaRegEdit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </Link>
                )}
            </div>

            {recentItems.map((item, index) => (
                item && (
                    <div key={item._id || index} className="flex items-center justify-between">
                        <div className="flex items-center my-3">
                            <div className={`cardIcon ${index === 1 ? 'bg-[#48CAE4]' : ''}`}>
                                <p className="text-[10px]">
                                    {item.createdAt
                                        ? `${new Date(item.createdAt).toLocaleString("en-US", { month: "short" })}`
                                        : "No Data"}
                                </p>
                                {item.date && <div><b>{item.date.slice(0, 2)}</b></div>}
                                {!item.date && item.createdAt && <div><b>{item.createdAt.slice(0, 2)}</b></div>}
                            </div>
                            <div className="ml-3">
                                {cardConfig.fields.map(field => (
                                    item[field.key] && (
                                        <div key={field.key} className="flex items-center">
                                            <b className="recentJobs">{field.label}</b>:
                                            <span className="ml-3">
                                                {formatValue(item[field.key], field)}
                                            </span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {cardConfig.viewAction === "vehicleDetails" ? (
                            <b onClick={() => onVehicleDetailsOpen(item._id)} className="cursor-pointer">
                                <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                            </b>
                        ) : (
                            <Link to={`${cardConfig.viewLink}?id=${item._id}`}>
                                <b className="cursor-pointer">
                                    <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                                </b>
                            </Link>
                        )}
                    </div>
                )
            ))}
        </Card>
    );
};

export default DataCard;