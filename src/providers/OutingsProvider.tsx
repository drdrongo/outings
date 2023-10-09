import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, ServiceAccountCredentials } from 'google-spreadsheet';
import { GoogleSpreadsheetRowDetailed } from '@/components/OutingListItem';
const { GoogleSpreadsheet: Spreadsheet } = require('google-spreadsheet');

type OutingProps = {
  title: string;
  description?: string;
  tags?: string;
  mapUrl?: string;
};
interface OutingsContextType {
  rows: GoogleSpreadsheetRowDetailed[];
  getOuting: (id: number) => GoogleSpreadsheetRowDetailed | undefined;
  addOuting: ({ title, description, tags, mapUrl }: OutingProps) => Promise<boolean>;
  updateOuting: (rowIdx: number, { title, description, tags, mapUrl }: OutingProps) => Promise<boolean>;
  loading: boolean;
  deleteOuting: (rowIdx: number) => void;
  allTags: string[];
}

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  rows: [],
  getOuting: (rowIdx: number) => undefined,
  addOuting: async () => false,
  updateOuting: async () => false,
  loading: false,
  deleteOuting: (rowIdx: number) => {},
  allTags: [],
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [doc, setDoc] = useState<GoogleSpreadsheet>();
  const [sheet, setSheet] = useState<GoogleSpreadsheetWorksheet>();
  const [rows, setRows] = useState<GoogleSpreadsheetRowDetailed[]>([]);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  const getOuting = (idx: number) => rows.find(row => row._rowNumber === idx);

  const updateOuting = useCallback(
    async (rowIdx: number, { title, description = '', tags = '', mapUrl = '' }: OutingProps) => {
      if (!sheet) {
        return false;
      }

      const row = rows.find(row => row._rowNumber === rowIdx);
      if (!row) {
        return false;
      }

      // For some reson I have to do it like this; the .assign fn doesnt work.
      row.title = title;
      row.description = description;
      row.tags = tags;
      row.mapUrl = mapUrl;

      // This doesn't return anything:
      await row.save();

      setRows(prev => {
        return prev.map(prevRow => {
          if (prevRow._rowNumber !== rowIdx) {
            return prevRow;
          }

          return row;
        });
      });
      if (tags.length) {
        const all: string[] = [...allTags, ...tags.split('|')];
        setAllTags(Array.from(new Set(all)).sort());
      }

      return true;
    },
    [sheet, allTags, rows]
  );

  const addOuting = useCallback(
    async ({ title, description = '', tags = '', mapUrl = '' }: OutingProps) => {
      if (!sheet) return false;

      const newRow = await sheet.addRow({ title, description, tags, mapUrl }, { insert: true, raw: true });

      if (newRow) {
        setRows(prev => [...prev, newRow as GoogleSpreadsheetRowDetailed]);
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

      const row = rows.find(row => row._rowNumber === rowNumber);
      if (!row) {
        console.error('Row not found');
        return;
      }

      row.disabled = 1; // update a value
      row.save(); // save updates
      setRows(prev => [...prev.filter(r => r._rowNumber !== rowNumber)]);
      // await rows[rowIdx].delete(); // delete a row
    },
    [rows]
  );

  // Gets doc
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CLIENT_EMAIL || !process.env.NEXT_PUBLIC_PRIVATE_KEY) {
      console.error('MISSING API CREDENTIALS');
      return;
    }

    const creds: ServiceAccountCredentials = {
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    };

    (async () => {
      setLoading(true);
      const doc: GoogleSpreadsheet = new Spreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);
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

    sheet.getRows().then(rows => {
      // Get the total tags
      let theTags: string[] = [];
      rows.forEach(({ tags }) => {
        if (!tags) return;

        theTags = [...theTags, ...tags.split('|')];
      });
      setAllTags(Array.from(new Set(theTags)).sort());

      // Get the row data
      setRows((rows as GoogleSpreadsheetRowDetailed[]) || []);
      setLoading(false);
    });
  }, [sheet]);

  return (
    <OutingsContext.Provider
      value={{
        rows,
        getOuting,
        addOuting,
        deleteOuting,
        updateOuting,
        loading,
        allTags,
      }}
    >
      {children}
    </OutingsContext.Provider>
  );
};

export const useOutingsContext = () => useContext(OutingsContext);
