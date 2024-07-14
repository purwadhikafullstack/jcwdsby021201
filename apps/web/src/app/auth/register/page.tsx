import { registerMetadata } from '@/app/meta-tag';
import RegisterForm from '@/components/form/RegisterForm';

export const metadata = registerMetadata;

export default function RegisterPage() {
  return <RegisterForm />;
}
