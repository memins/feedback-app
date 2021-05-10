import Head from 'next/head';
import { auth } from 'firebase';
import styles from '../styles/Home.module.css';
import { useAuth } from '../lib/auth';
import { Button, Heading, Text, Code } from '@chakra-ui';

export default function Home() {
  const auth = useAuth();

  return (
    <div className={styles.container}>
      <main>
        <Heading>Fast Feedback</Heading>
        <Text>
          Current user: <Code>{auth.user ? auth.user.email : 'None'}</Code>
        </Text>
        {auth.user ? (
          <Button onClick={(e) => auth.signout()}>Sign Out</Button>
        ) : (
          <Button onClick={(e) => auth.signinWithGitHub()}>Sign In</Button>
        )}
      </main>
    </div>
  );
}
