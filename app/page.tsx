import { geographyData } from '@/lib/geography';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl font-black">国名マスター</h1>
            <div className="my-12 flex flex-col items-center gap-y-4">
                <Link href="/all" className="hover:underline">
                    全世界モード（{geographyData.objects.world.geometries.length}カ国）
                </Link>
                <Link href="/asia" className="hover:underline">
                    アジアモード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === 'アジア',
                        ).length
                    }
                    カ国）
                </Link>
                <Link href="/europe" className="hover:underline">
                    ヨーロッパモード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === 'ヨーロッパ',
                        ).length
                    }
                    カ国）
                </Link>
                <Link href="/africa" className="hover:underline">
                    アフリカモード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === 'アフリカ',
                        ).length
                    }
                    カ国）
                </Link>
                <Link href="/northamerica" className="hover:underline">
                    北米モード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === '北アメリカ',
                        ).length
                    }
                    カ国）
                </Link>
                <Link href="/southamerica" className="hover:underline">
                    南米モード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === '南アメリカ',
                        ).length
                    }
                    カ国）
                </Link>
                <Link href="/oceania" className="hover:underline">
                    オセアニアモード（
                    {
                        geographyData.objects.world.geometries.filter(
                            (item) => item.properties.region === 'オセアニア',
                        ).length
                    }
                    カ国）
                </Link>
                <div className="mt-8">
                    <Link href="/exam" className="bg-blue-500 text-white px-4 py-2 rounded">
                        試験モード（
                        {geographyData.objects.world.geometries.length}
                        カ国）
                    </Link>
                </div>
            </div>
        </div>
    );
}
