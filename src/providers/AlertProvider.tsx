import { Alert, AlertColor } from '@mui/material';
import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';
import styles from '@/components/Alerts.module.css';

interface ContextType {
  addAlert: Function;
}

interface IAlert {
  severity: AlertColor | undefined;
  label: string;
}

export const AlertContext = createContext<ContextType>({
  addAlert: () => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  const addAlert = (alert: IAlert) => {
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alt => alt.label !== alert.label));
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
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
