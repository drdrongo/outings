import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import styles from './styles.module.css';
import { Save } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';

export type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const form = useForm<Inputs>({ mode: 'onChange' });

  const { currentUser, login } = useAuthContext();

  const {
    control,
    formState: { isValid },
  } = form;

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    login(email, password);
  };

  if (currentUser) {
    router.push('/outings');
    return;
  }

  return (
    <div>
      <h3>Bread Logo</h3>

      <h3>Remember The Bread</h3>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField
              id="email"
              value={value || ''} // add a default empty string if value is undefined
              onChange={onChange}
              placeholder="Email"
              className={styles.formItem}
              inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
              variant="outlined"
              label={<Typography className={styles.label}>Email</Typography>}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField
              id="password"
              value={value || ''} // add a default empty string if value is undefined
              onChange={onChange}
              placeholder="Password"
              className={styles.formItem}
              inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
              variant="outlined"
              label={<Typography className={styles.label}>Password</Typography>}
            />
          )}
        />

        <Button
          variant="contained"
          size="large"
          type="submit"
          className={styles.save}
          startIcon={<Save />}
          color="primary"
          disabled={!isValid}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
