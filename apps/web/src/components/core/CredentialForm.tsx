import { signIn } from '@/utils/auth';

export default function CredentialForm() {
  return (
    <form
      action={async (formData) => {
        'use server';

        // console.log(formData);

        await signIn('credentials', formData);
      }}
    >
      <div>
        <label>
          Email
          <input name="email" type="email" />
        </label>
      </div>
      <div>
        <label>
          Password
          <input name="password" type="password" />
        </label>
      </div>
      <button>Sign In</button>
    </form>
  );
}
