import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-black">国名マスター</h1>
      <div className="my-12">
        <Link href="/all" className="hover:underline">全世界モード（202カ国）</Link>

      </div>

    </div>
  );
}
