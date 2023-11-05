import { Alert, AlertColor } from '@mui/material';
import { ReactNode, createContext, useContext, useState } from 'react';
import styles from '@/components/Alerts.module.css';

interface ContextType {
  addAlert: Function;
  getOutingAlertMsg: (
    success: boolean,
    method: 'add' | 'upd' | 'del'
  ) => {
    severity: 'success' | 'error';
    label: string;
  };
}

interface IAlert {
  severity: AlertColor | undefined;
  label: string;
}

export const AlertContext = createContext<ContextType>({
  addAlert: () => {},
  getOutingAlertMsg: () => ({ severity: 'error', label: 'Error' }),
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  // Get the alert message parameters
  const getOutingAlertMsg = (succ: boolean, method: 'add' | 'upd' | 'del') => {
    const severity: 'success' | 'error' = succ ? 'success' : 'error';
    const methodWord =
      method === 'add' ? 'create' : method === 'upd' ? 'update' : 'delete';
    const label = succ ? `Outing ${methodWord}d` : `Failed to ${methodWord} outing`;
    return { severity, label };
  };

  const addAlert = (alert: IAlert) => {
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alt) => alt.label !== alert.label));
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ addAlert, getOutingAlertMsg }}>
      <>
        <div className={styles.alertBox}>
          {alerts.map(({ severity, label }) => {
            return (
              <Alert key={label} severity={severity} className={styles.alert}>
                {label}
              </Alert>
            );
          })}
        </div>
        {children}
      </>
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
