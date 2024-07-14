import { loginMetadata } from '@/app/meta-tag';
import LoginForm from '@/components/form/LoginForm';

export const metadata = loginMetadata;

export default async function LoginPage() {
  return <LoginForm />;
}
