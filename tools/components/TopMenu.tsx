import Image from "next/image"; 
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function TopMenu() {
  const session = await getServerSession();


  return (
  <div className="w-full flex flex-row items-center bg-gradient-to-r from-blue-100 via-white to-blue-100 shadow-md h-20 px-8 sticky top-0 z-50">
  <div className="flex flex-row items-center gap-4 m-4">
      {
        session? <Link href="/api/auth/signout" className="text-red-600 hover:text-red-800 transition-colors duration-200 px-2">
          Sign Out of {session.user?.name} </Link> :
          <Link href="/api/auth/signin" className="text-green-600 hover:text-green-800 transition-colors duration-200 px-2">
          Sign In</Link>
      }
      {
        <TopMenuItem
          title={<span className="text-gray-700 hover:text-gray-900 transition-colors duration-200 px-2">mybooking</span>}
          pageRef="/mybooking"
        />
      }
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-row items-center gap-4">
        <TopMenuItem
          title={<span className="text-blue-700 font-bold text-lg px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 shadow-sm">Booking</span>}
          pageRef="/booking"
        />
        <Image
          src="/img/logo.png"
          alt="logo"
          width={0}
          height={0}
          sizes="100vh"
          className="h-16 w-auto object-contain drop-shadow-md bg-white rounded-full p-1 border border-blue-200"
          priority
        />
      </div>
    </div>
  );
}