import { forgotPasswordMetadata } from '@/app/meta-tag';
import ForgotPasswordForm from '@/components/form/ForgotPasswordForm';

export const metadata = forgotPasswordMetadata;

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
