import { createContext, ReactNode, useContext, useState } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { ToastType } from "../types";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastProps = {
  type: ToastType;
  title: string;
  description?: string;
};

interface ToastContextType {
  toast: (options: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<ToastType>(ToastType.Info);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const toast = ({ type, title, description }: ToastProps) => {
    setToastType(type);
    setTitle(title);
    setDescription(description || "");
    setOpen(true);
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case ToastType.Success:
        return "bg-green-600";
      case ToastType.Error:
        return "bg-red-600";
      case ToastType.Info:
      default:
        return "bg-blue-600";
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case ToastType.Success:
        return <CheckCircle className="w-5 h-5 mr-2" />;
      case ToastType.Error:
        return <AlertCircle className="w-5 h-5 mr-2" />;
      case ToastType.Info:
      default:
        return <Info className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPrimitive.Provider swipeDirection="right">
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          duration={2000}
          className={`flex items-start text-white rounded p-4 shadow-md ${getToastStyles(
            toastType
          )}`}
        >
          {getToastIcon(toastType)}
          <div>
            <ToastPrimitive.Title className="font-bold">
              {title}
            </ToastPrimitive.Title>
            {description && (
              <ToastPrimitive.Description className="text-sm mt-1">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 w-80 max-w-full" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
