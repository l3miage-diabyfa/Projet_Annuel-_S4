import React from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

type AlertMode = "success" | "error" | "info" | "warning";

interface AlertProps {
  mode?: AlertMode;
  children: React.ReactNode;
  className?: string;
}

const modeConfig: Record<
  AlertMode,
  {
    container: string;
    icon: React.ReactNode;
    iconColor: string;
  }
> = {
  success: {
    container: "bg-green-50 border border-green-300 text-green-800",
    icon: <FiCheckCircle className="w-5 h-5" />,
    iconColor: "text-green-500",
  },
  error: {
    container: "bg-red-50 border border-red-300 text-red-800",
    icon: <FiAlertCircle className="w-5 h-5" />,
    iconColor: "text-red-500",
  },
  info: {
    container: "bg-blue-50 border border-blue-300 text-blue-800",
    icon: <FiInfo className="w-5 h-5" />,
    iconColor: "text-blue-500",
  },
  warning: {
    container: "bg-yellow-50 border border-yellow-300 text-yellow-800",
    icon: <FiAlertTriangle className="w-5 h-5" />,
    iconColor: "text-yellow-500",
  },
};

export default function Alert({
  mode = "info",
  children,
  className = "",
}: AlertProps) {
  const config = modeConfig[mode];

  return (
    <div
      className={`flex items-center gap-2 ${config.container} px-4 py-3 rounded-lg my-4 text-sm font-medium justify-center ${className}`}
      role="alert"
    >
      <span className={config.iconColor}>{config.icon}</span>
      <span>{children}</span>
    </div>
  );
}
