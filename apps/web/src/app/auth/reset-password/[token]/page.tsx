import ResetPasswordForm from '@/components/form/ResetPasswordForm';
import { authPages } from '@/utils/routes';
import jwt from 'jsonwebtoken';
import TokenExpired from '@/components/error/TokenExpired';
import { resetPasswordMetadata } from '@/app/meta-tag';

type Props = {
  params: { token: string };
};

export const metadata = resetPasswordMetadata;

export default async function ResetPasswordPage({ params }: Props) {
  try {
    jwt.verify(
      params.token,
      process.env.JWT_SECRET || 'secret',
    ) as jwt.JwtPayload;
  } catch (error) {
    return <TokenExpired />;
  }

  return <ResetPasswordForm path={authPages.resetPassword.path} />;
}
