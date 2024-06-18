'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ErrorComponent: FC = () => {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center overflow-hidden">
      <div className="container row flex-col md:flex-row px-5 text-gray-700 gap-12">
        <div className="max-w-md">
          <div className="text-5xl font-dark font-bold">500</div>
          <p className="text-2xl md:text-3xl font-light leading-normal mb-10">
            Sorry, something went wrong with our servers.
          </p>
          <p className="mb-2">But don&#39;t worry, you can find plenty of other things on our homepage.</p>
          <button
            className="-ml-1 px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Back to homepage
          </button>
        </div>
        <div className="max-w-lg">
          <Image
            src="/logo-small.webp"
            height={150}
            width={150}
            alt="logo"
          />
        </div>
      </div>
    </div>
  )
}

export default ErrorComponent;
