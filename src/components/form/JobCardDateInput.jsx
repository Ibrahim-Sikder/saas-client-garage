/* eslint-disable react/prop-types */

const JobCardDateInput = ({
  register,
  name,
  label,
  required = false,
  error,
  helperText,
}) => {
  return (
    <div>
      <input
        className={`border h-14 w-60 px-3 rounded-sm ${
          error ? "border-red-500" : ""
        }`}
        type="date"
        {...register(name, {
          required: required ? `${label} is required!` : false,
        })}
        defaultValue={new Date().toISOString().slice(0, 10)}
        min={new Date().toISOString().split("T")[0]}
      />
      {error && (
        <p className="text-red-500 text-[12px] mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default JobCardDateInput;