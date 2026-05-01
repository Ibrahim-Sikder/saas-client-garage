/* eslint-disable react/prop-types */
import Card from "../Card/Card";
import { formatValue } from "./FormatedValue";

const ContactInfoCard = ({ config, profileData }) => (

    <Card>
        <h3 className="mb-4 text-xl font-semibold">{config.contactInfo.title}</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex">
                <div className="flex flex-col space-y-1 w-[150px]">
                    {config.contactInfo.fields.map(field => (
                        <b key={field.key}>{field.label}</b>
                    ))}
                </div>
                <div className="flex flex-col space-y-1 capitalize">
                    {config.contactInfo.fields.map(field => (
                        <span key={field.key}>
                            : {formatValue(profileData?.data?.[field.key], field)}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </Card>
);

export default ContactInfoCard;