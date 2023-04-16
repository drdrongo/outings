import Layout from '@/components/Layout';
import { useOutingsContext } from '@/providers/OutingsProvider';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/NewOuting.module.css';
import Head from 'next/head';
import { Save } from '@mui/icons-material';
import { useRouter } from 'next/router';

const NewOuting = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [continueAdding, setContinueAdding] = useState(false);

  const toggleContinueAdding = () => setContinueAdding((prev) => !prev);
  const { addOuting } = useOutingsContext();

  const createOuting = useCallback(() => {
    addOuting({ title, description });
    setTitle('');
    setDescription('');
    if (!continueAdding) router.replace('/');
  }, [title, description, continueAdding, router, addOuting]);

  return (
    <>
      <Head>
        <title>New Outing</title>
        <meta name='description' content='Remember what you wanted to do' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className={styles.main}>
          <TextField
            value={title}
            placeholder='Outing Title'
            name='title'
            onChange={(e) => setTitle(e.target.value)}
            className={styles.fullWidth}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant='filled'
          />
          <TextField
            value={description}
            placeholder='Outing Description'
            name='description'
            onChange={(e) => setDescription(e.target.value)}
            multiline
            className={styles.fullWidth}
            minRows={5}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant='filled'
          />

          <FormControlLabel
            control={
              <Checkbox
                onChange={toggleContinueAdding}
                checked={continueAdding}
                style={{
                  transform: 'scale(1.4)',
                }}
              />
            }
            label='Continue Creating Outings'
          />

          <Button
            variant='contained'
            onClick={createOuting}
            size='large'
            className={styles.save}
            startIcon={<Save />}
            color='primary'
            disabled={[title, description].includes('')}
          >
            Create Outing
          </Button>
        </main>
      </Layout>
    </>
  );
};

export default NewOuting;
