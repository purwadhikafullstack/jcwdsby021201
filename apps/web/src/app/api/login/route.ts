import { login } from '@/features/auth/login/loginFetchers';
import { signIn } from '@/utils/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const res = await login(body);

  if (res.rc === 400) return Response.json(res);
  await signIn('credentials', body);
  return Response.json(res);
}
