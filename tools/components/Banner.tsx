'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css';
import Image from "next/image";
import { useSession } from 'next-auth/react';

export default function Banner() {
  const covers = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg",
  ];
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className={styles.banner} onClick={() => setIndex((index + 1) % covers.length)} style={{position: 'relative'}}>
      <Image
        src={covers[index]}
        alt="cover"
        fill={true}
        objectFit="cover"
      />
      <div className={styles.bannerText}>
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
          where every event finds its venue
        </h1>
        <p className="mt-4 text-lg font-medium text-white drop-shadow">
          Discover the perfect venue for your next event. From weddings to
          corporate gatherings, we have a wide range of options to suit your
          needs.
        </p>
      </div>
      {
        session? <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg text-lg">
          Welcome {session.user?.name}
        </div> : null
      }
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '12px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
        onClick={e => {
          e.stopPropagation();
          router.push('/venue');
        }}
      >
        Select Venue
      </button>
    </div>
  );
}