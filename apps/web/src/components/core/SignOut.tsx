import { signOut } from '@/utils/auth';

export default function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
