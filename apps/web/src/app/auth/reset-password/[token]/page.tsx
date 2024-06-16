import ResetPasswordForm from '@/components/form/ResetPasswordForm';
import { authPages } from '@/utils/routes';
import { notFound } from 'next/navigation';
import jwt from 'jsonwebtoken';
import TokenExpired from '@/components/error/TokenExpired';

type Props = {
  params: { token: string };
};

export default function ResetPasswordPage({ params }: Props) {
  try {
    const decoded = jwt.verify(
      params.token,
      process.env.JWT_SECRET || 'secret',
    ) as jwt.JwtPayload;

    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      return <TokenExpired />;
    }
  } catch (error) {
    notFound();
  }

  return <ResetPasswordForm path={authPages.resetPassword.path} />;
}
