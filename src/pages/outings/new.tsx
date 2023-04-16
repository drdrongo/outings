import Layout from '@/components/Layout';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { TextField, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import styles from '@/styles/NewOuting.module.css';
import Head from 'next/head';

const NewOuting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { addOuting } = useOutingsContext();

  return (
    <>
    <Head>
    <title>Outings</title>
    <meta name='description' content='Remember what you wanted to do' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' href='/favicon.ico' />
  </Head>
    <Layout>
      <main className={styles.main}>
        <TextField
          placeholder='Outing Title'
          name='title'
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextareaAutosize
          onResize={(e) => {}}
          name='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          // onKeyDown={(e) => e.metaKey && e.key === 'Enter' && addRow()}
        />
        <button onClick={() => addOuting({ title, description })}>
          Create Outing
        </button>
      </main>
    </Layout>
    </>
  );
};

export default NewOuting;
