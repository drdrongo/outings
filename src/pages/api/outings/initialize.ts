import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet, ServiceAccountCredentials } from 'google-spreadsheet';
import { stringify } from 'flatted';

const { GoogleSpreadsheet: Spreadsheet } = require('google-spreadsheet');

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
    console.error('MISSING API CREDENTIALS');
    return { error: 'farts' };
  }

  const doc: GoogleSpreadsheet = new Spreadsheet(process.env.GOOGLE_SHEET_ID);
  const creds: ServiceAccountCredentials = {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  };

  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  // Extract only the necessary data to pass to the client-side
  const docData = {
    title: doc.title,
    sheetCount: doc.sheetCount,
    spreadsheetId: doc.spreadsheetId,
    // sheet,
    rows,
  };
  res.status(200).json({ docData });
};

export default handler;
