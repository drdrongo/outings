import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { OutingsRowData } from '@/types/outings';
import { loadAuth, loadDoc, loadRows, loadSheet } from '@/utils/googleSpreadsheet';
import { uuid } from '@/utils/uuid';

type OutingProps = {
  title: string;
  description?: string;
  tags?: string;
  mapUrl?: string;
};

interface OutingsContextType {
  allTags: string[];
  rows: GoogleSpreadsheetRow<OutingsRowData>[];
  loading: boolean;
  getOuting: (uuid: string) => GoogleSpreadsheetRow<OutingsRowData> | undefined;
  addOuting: ({ title, description, tags, mapUrl }: OutingProps) => Promise<boolean>;
  updateOuting: (
    uuid: string,
    { title, description, tags, mapUrl }: OutingProps
  ) => Promise<boolean>;
  deleteOuting: (uuid: string) => void;
}

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  rows: [],
  allTags: [],
  loading: false,
  getOuting: () => undefined,
  addOuting: async () => false,
  updateOuting: async () => false,
  deleteOuting: () => {},
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [sheet, setSheet] = useState<GoogleSpreadsheetWorksheet>();
  const [rows, setRows] = useState<GoogleSpreadsheetRow<OutingsRowData>[]>([]);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  const getOuting = (uuid: string) => rows.find(row => row.get('uuid') === uuid);

  const updateOuting = useCallback(
    async (
      uuid: string,
      { title, description = '', tags = '', mapUrl = '' }: OutingProps
    ) => {
      const row = rows.find(row => row.get('uuid') === uuid);
      if (!row) {
        return false;
      }

      // For some reson I have to do it like this; the .assign fn doesnt work.
      row.assign({
        uuid,
        title,
        description,
        tags,
        mapUrl,
      });

      // This doesn't return anything:
      await row.save();

      // Update the client state
      setRows(prev =>
        prev.map(prevRow => (prevRow.get('uuid') !== uuid ? prevRow : row))
      );

      return true;
    },
    [rows]
  );

  const addOuting = useCallback(
    async ({ title, description = '', tags = '', mapUrl = '' }: OutingProps) => {
      if (!sheet) return false;

      const newRowValues: OutingsRowData = {
        uuid: uuid(),
        title,
        description,
        tags,
        mapUrl,
      };

      // The following is a little risky but I have to do it, since addRow doesn't take user-types
      const newRow = (await sheet.addRow(newRowValues, {
        insert: true,
        raw: true,
      })) as GoogleSpreadsheetRow<OutingsRowData>;

      if (newRow) {
        setRows(prev => [...prev, newRow]);
      } else {
        console.error(newRow, 'problem adding row');
      }
      return !!newRow;
    },
    [sheet]
  );

  const deleteOuting = useCallback(
    async (uuid: string) => {
      if (!rows) return;

      const row = rows.find(row => row.get('uuid') === uuid);
      if (!row) {
        console.error('Row not found');
        return;
      }

      row.set('disabled', 1); // update a value
      row.save(); // save updates
      setRows(prev =>
        prev.map(prevRow => (prevRow.get('uuid') !== uuid ? prevRow : row))
      );
    },
    [rows]
  );

  // Gets doc
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (
        !process.env.NEXT_PUBLIC_CLIENT_EMAIL ||
        !process.env.NEXT_PUBLIC_PRIVATE_KEY ||
        !process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
      ) {
        setLoading(false);
        console.error('MISSING API CREDENTIALS');
        return;
      }
      const jwt = loadAuth();
      const doc = await loadDoc(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID, jwt);
      if (!doc) {
        setLoading(false);
        console.error('doc not found');
        return;
      }

      const sheet = loadSheet(doc);
      setSheet(sheet);

      const rows = await loadRows(sheet);
      setRows(rows);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let theTags: string[] = [];
    rows.forEach(row => {
      const tags = row.get('tags');
      if (!tags) return;

      theTags = [...theTags, ...tags.split('|')];
    });
    setAllTags(Array.from(new Set(theTags)).sort());
  }, [rows]);

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
