import Image from 'next/image';

import logo from '@/public/logo/logo.png';

export default function Logo() {
  return <Image alt="Logo" src={logo} height={35} width={118} />;
}
