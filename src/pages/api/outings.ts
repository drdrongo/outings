import axios from 'axios';

// export const initialize = async () => {
// // Fetch necessary data for the movie using params.id
//   const doc = await axios.get('/api/movies/initialize');
//   console.log({ docInInitialize: doc });
//   return doc;
// };


  // // Change sheet to index of whatever.
  // const changeSheet = useCallback(
  //   (i = 0) => {
  //     doc && setSheet(doc.sheetsByIndex[i]);
  //   },
  //   [doc]
  // );

  // useEffect(() => {

  //   (async () => {

  //     console.log('=====')
  //     console.log(doc);
  //   if (!doc) return;
  //     await doc.loadInfo(); // <== What does this thing do?
  //     setSheet(doc.sheetsByIndex[0]);
  //   })();
  // }, [doc]);

  // // Fetches and sets the rows for the current sheet
  // useEffect(() => {
  //   (async () => {
  //     if (!sheet) return;

  //     const sheetRows = await sheet.getRows();
  //     setRows(sheetRows);
  //   })();
  // }, [sheet]);
