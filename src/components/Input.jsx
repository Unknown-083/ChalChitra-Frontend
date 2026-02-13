import { forwardRef, useId } from "react";

const Input = ({
  label,
  type = "text",
  classname = "",
  placeholder = "",
  value,
  bgColor = "",
  textColor = "text-white",
  flexCol = true,
  ...props
}, ref) => {
  const id = useId();

  return (
    <div className={`flex ${flexCol ? "flex-col" : "items-center gap-3"} w-full`}>
      {label && <label htmlFor={id} className="text-md mb-1 font-bold">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...(type !== "file" && { value })}
        className={`border border-[#272727] rounded-full px-4 py-2 ${bgColor} ${textColor} ${classname}`}
        id={id}
        {...props}
      />
    </div>
  );
};

export default forwardRef(Input);
