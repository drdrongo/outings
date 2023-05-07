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

interface OutingsContextType {
  rows: GoogleSpreadsheetRow[];
  addOuting: ({
    title,
    description,
    tags,
  }: {
    title?: string | undefined;
    description?: string | undefined;
    tags?: string | undefined;
  }) => Promise<boolean>;
  loading: boolean;
  deleteOuting: (rowIdx: number) => void;
  modalOpen: boolean;
  toggleModal: () => void;
  allTags: string[];
}

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  rows: [],
  addOuting: async () => false,
  loading: false,
  deleteOuting: (rowIdx: number) => {},
  modalOpen: false,
  toggleModal: () => {},
  allTags: [],
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [doc, setDoc] = useState<GoogleSpreadsheet>();
  const [sheet, setSheet] = useState<GoogleSpreadsheetWorksheet>();
  const [rows, setRows] = useState<GoogleSpreadsheetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  const toggleModal = () => setModalOpen((prev) => !prev);

  const addOuting = useCallback(
    async ({ title = '', description = '', tags = '' }) => {
      if (!sheet) return false;

      const newRow = await sheet.addRow(
        { title, description, tags },
        { insert: true, raw: true }
      );

      if (newRow) {
        setRows((prev) => [...prev, newRow]);
        if (tags.length) {
          const all: string[] = [...allTags, ...tags.split('|')];
          setAllTags(Array.from(new Set(all)).sort());
        }
      } else {
        console.error(newRow, 'problem adding row');
      }

      return !!newRow;
    },
    [sheet, allTags]
  );

  const deleteOuting = useCallback(
    async (rowNumber: number) => {
      if (!rows) return;

      const row = rows.find((row) => row._rowNumber === rowNumber);
      if (!row) {
        console.error('Row not found');
        return;
      }

      row.disabled = 1; // update a value
      row.save(); // save updates
      setRows((prev) => [...prev.filter((r) => r._rowNumber !== rowNumber)]);
      // await rows[rowIdx].delete(); // delete a row
    },
    [rows]
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
      setLoading(true);
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
    if (!sheet) return;

    sheet.getRows().then((rows) => {
      // Get the total tags
      let theTags: string[] = [];
      rows.forEach(({ tags }) => {
        if (!tags) return;

        theTags = [...theTags, ...tags.split('|')];
      });
      setAllTags(Array.from(new Set(theTags)).sort());

      // Get the row data
      setRows(rows || []);
      setLoading(false);
    });
  }, [sheet]);

  return (
    <OutingsContext.Provider
      value={{
        rows,
        addOuting,
        deleteOuting,
        loading,
        modalOpen,
        toggleModal,
        allTags,
      }}
    >
      {children}
    </OutingsContext.Provider>
  );
};

export const useOutingsContext = () => useContext(OutingsContext);
