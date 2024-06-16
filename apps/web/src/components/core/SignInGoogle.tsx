import { signIn } from '@/utils/auth';

export default function SignInGoogle() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
