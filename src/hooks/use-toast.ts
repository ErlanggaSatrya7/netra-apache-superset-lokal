import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// ... (kode hook standar shadcn toast)
export function useToast() {
  const [state, setState] = React.useState<{ toasts: ToasterToast[] }>({
    toasts: [],
  });

  const toast = (props: ToasterToast) => {
    const id = genId();
    setState((state) => ({
      toasts: [{ ...props, id, open: true }, ...state.toasts].slice(
        0,
        TOAST_LIMIT
      ),
    }));
    return { id, dismiss: () => {}, update: () => {} };
  };

  return { ...state, toast, dismiss: () => {} };
}
