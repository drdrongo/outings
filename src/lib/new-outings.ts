import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

const client_email = 'process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL';
const private_key = 'process.env.REACT_APP_GOOGLE_PRIVATE_KEY';
const creds = { client_email, private_key };

// we will use a provider for this. 


const [sheet, setSheet] = useState<GoogleSpreadsheetWorksheet>();
const [rows, setRows] = useState<GoogleSpreadsheetRow[]>([]);

const doc = useMemo(
  () => new GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SHEET_ID),
  []
);

const getSheetRows = useCallback(async () => {
  if (!sheet) return;

  const sheetRows = await sheet.getRows();
  setRows(sheetRows);
}, [sheet]);

const changeSheet = useCallback((idx = 0) => {
  setSheet(doc.sheetsByIndex[idx]);
}, []);


useEffect(() => {
  if (!creds.client_email || !creds.private_key) {
    console.error('Missing google api credentials');
    return;
  }

  (async () => {
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key?.replace(/\\n/gm, '\n'),
    });
    // await doc.getInfo(); // <== What does this thing do?
    changeSheet(0);
  })();
}, []);