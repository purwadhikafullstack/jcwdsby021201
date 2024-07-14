import ResetPasswordForm from '@/components/form/ResetPasswordForm';
import { authPages } from '@/utils/routes';
import jwt from 'jsonwebtoken';
import TokenExpired from '@/components/error/TokenExpired';
import { verifyMetadata } from '@/app/meta-tag';

type Props = {
  params: { token: string };
};
export const metadata = verifyMetadata;

export default function VerifyPage({ params }: Props) {
  try {
    jwt.verify(
      params.token,
      process.env.JWT_SECRET || 'secret',
    ) as jwt.JwtPayload;
  } catch (error) {
    return <TokenExpired />;
  }

  return (
    <ResetPasswordForm
      name="Create New Password"
      path={authPages.verify.path}
    />
  );
}
