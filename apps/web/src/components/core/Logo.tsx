import Link from 'next/link';
import Image from 'next/image';

import logo from '@/public/logo/logo1.png';

export default function Logo() {
  return (
    <Link href="/" passHref>
      <Image alt="Logo" src={logo} height={35} width={118} />
    </Link>
  );
}
