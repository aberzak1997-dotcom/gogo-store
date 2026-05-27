import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0E121A",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          paddingLeft: "16px",
        },
        classNames: {
          toast: "wivi-toast",
          description: "!text-white/50 !text-[12px]",
          actionButton: "!bg-[#1160CB] !text-white !rounded-[6px]",
          cancelButton: "!bg-white/10 !text-white/70 !rounded-[6px]",
          success: "wivi-toast-success",
          error: "wivi-toast-error",
          info: "wivi-toast-info",
          warning: "wivi-toast-warning",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
