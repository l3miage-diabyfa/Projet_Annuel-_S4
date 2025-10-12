import React, { useState, useCallback } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      type = "text",
      error,
      containerClassName = "",
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && !showPassword ? "password" : type;

    const togglePassword = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    return (
      <div className={`flex flex-col ${containerClassName}`}>
        {label && (
          <label className="text-gray-900 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`input ${isPassword ? "pr-12" : ""} ${inputClassName}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-[45%] -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:text-gray-700"
              onClick={togglePassword}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <FiEyeOff size={20} className="flex-shrink-0" />
              ) : (
                <FiEye size={20} className="flex-shrink-0" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-red-600 text-xs font-medium mt-1" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
