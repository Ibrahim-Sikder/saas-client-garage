/* eslint-disable react/prop-types */
const FinancialCards = ({ financialCards }) => {
    return (
        <div className="flex flex-wrap gap-3 items-center relative gap-x-3 customerSingleRightCard mt-5 md:mt-0">
            {financialCards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-r ${card.gradient} border h-16 w-32 rounded-md relative`}
                >
                    <div className="flex mt-2 flex-col items-center justify-center">
                        <p className="text-xs">{card.label}</p>
                        <b>{card.value} ৳</b>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FinancialCards;