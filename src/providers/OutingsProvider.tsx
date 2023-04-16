import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
  ServiceAccountCredentials,
} from 'google-spreadsheet';
const { GoogleSpreadsheet: Spreadsheet } = require('google-spreadsheet');



// Type '({ title, description }: { title?: string | undefined; description?: string | undefined; }) => Promise<void>' is not assignable to type '() => Promise<void>'.ts(2322)



interface OutingsContextType {
  rows: GoogleSpreadsheetRow[];
  addOuting: ({ title, description }: { title?: string | undefined; description?: string | undefined; }) => Promise<void>;
}

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  rows: [],
  addOuting: async () => {},
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [doc, setDoc] = useState<GoogleSpreadsheet>();
  const [sheet, setSheet] = useState<GoogleSpreadsheetWorksheet>();
  const [rows, setRows] = useState<GoogleSpreadsheetRow[]>([]);

  const addOuting = useCallback(
    async ({ title = '', description = '' }) => {
      if (!sheet) return;

      const newRow = await sheet.addRow(
        { title, description },
        { insert: true, raw: true }
      );
      if (newRow) {
        setRows((prev) => [...prev, newRow]);
      } else {
        console.error(newRow, 'problem adding row');
      }
    },
    [sheet]
  );

  // Gets doc
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_CLIENT_EMAIL ||
      !process.env.NEXT_PUBLIC_PRIVATE_KEY
    ) {
      console.error('MISSING API CREDENTIALS');
      return;
    }

    const creds: ServiceAccountCredentials = {
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    };

    (async () => {
      const doc: GoogleSpreadsheet = new Spreadsheet(
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      setDoc(doc);
    })();
  }, []);

  // Gets sheets
  useEffect(() => {
    if (doc) setSheet(doc.sheetsByIndex[0]);
  }, [doc]);

  // Gets rows
  useEffect(() => {
    if (sheet) sheet.getRows().then((rows) => setRows(rows));
  }, [sheet]);

  return (
    <OutingsContext.Provider value={{ rows, addOuting }}>
      {children}
    </OutingsContext.Provider>
  );
};

export const useOutingsContext = () => useContext(OutingsContext);
