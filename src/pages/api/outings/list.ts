import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { loadAuth, loadDoc, loadRows, loadSheet } from '@/utils/googleSpreadsheet';

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !process.env.CLIENT_EMAIL ||
    !process.env.PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    console.error('MISSING API CREDENTIALS');
    return;
  }
  const jwt = loadAuth();
  const doc = await loadDoc(process.env.GOOGLE_SHEET_ID, jwt);
  if (!doc) {
    console.error('doc not found');
    return;
  }

  const sheet = loadSheet(doc);
  const rows = await loadRows(sheet);
  res.status(200).json({ rows });
};

export default handler;
