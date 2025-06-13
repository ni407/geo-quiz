import { geographyData } from '@/lib/geography';
import Link from 'next/link';
import { FunctionComponent } from 'react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 lg:px-12 py-6">
            <div className="flex items-center mb-4 gap-x-2">
                <img src="/logo.png" alt="GeoQuiz Logo" className="size-20 mb-4 drop-shadow-lg" />
                <h1 className="text-5xl font-extrabold text-indigo-700 tracking-tight my-2">
                    GeoQuiz
                </h1>
            </div>

            <div className="w-full grid lg:grid-cols-3 gap-4">
                <ModeCard title="地図モード">
                    <MainMenuLink
                        href="/quiz/map/exam"
                        label={`地図検定（${geographyData.objects.world.geometries.length}カ国）`}
                    />

                    <MenuLink
                        href="/quiz/map/all"
                        label="ワールドツアー"
                        count={geographyData.objects.world.geometries.length}
                    />
                    <MenuLink
                        href="/quiz/map/asia"
                        label="アジアツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'アジア',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/map/europe"
                        label="ヨーロッパツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'ヨーロッパ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/map/africa"
                        label="アフリカツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'アフリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/map/northamerica"
                        label="北中米ツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === '北アメリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/map/southamerica"
                        label="南米ツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === '南アメリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/map/oceania"
                        label="オセアニアツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'オセアニア',
                            ).length
                        }
                    />
                </ModeCard>
                <ModeCard title="国旗モード">
                    <MainMenuLink
                        href="/quiz/flag/exam"
                        label={`国旗検定（${geographyData.objects.world.geometries.length}カ国）`}
                    />

                    <MenuLink
                        href="/quiz/flag/all"
                        label="ワールドツアー"
                        count={geographyData.objects.world.geometries.length}
                    />
                    <MenuLink
                        href="/quiz/flag/asia"
                        label="アジアツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'アジア',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/flag/europe"
                        label="ヨーロッパツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'ヨーロッパ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/flag/africa"
                        label="アフリカツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'アフリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/flag/northamerica"
                        label="北中米ツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === '北アメリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/flag/southamerica"
                        label="南米ツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === '南アメリカ',
                            ).length
                        }
                    />
                    <MenuLink
                        href="/quiz/flag/oceania"
                        label="オセアニアツアー"
                        count={
                            geographyData.objects.world.geometries.filter(
                                (item) => item.properties.region === 'オセアニア',
                            ).length
                        }
                    />
                </ModeCard>
                <ModeCard title="辞典モード">
                    <MainMenuLink href="/dictionary" label="国辞典" />
                </ModeCard>
            </div>
        </div>
    );
}

const ModeCard: FunctionComponent<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <h2 className="text-center font-bold text-3xl my-4">{title}</h2>
            {children}
        </div>
    );
};

const MenuLink: FunctionComponent<{ href: string; label: string; count: number }> = ({
    href,
    label,
    count,
}) => {
    return (
        <Link
            href={href}
            className={
                'flex items-center justify-between px-4 py-3 rounded-lg hover:shadow-md transition border border-gray-100 hover:bg-gray-50 group bg-gray-100'
            }
        >
            <span className={'font-semibold text-lg '}>{label}</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-700">{count}カ国</span>
        </Link>
    );
};

const MainMenuLink: FunctionComponent<{
    href: string;
    label: string;
}> = ({ href, label }) => {
    return (
        <Link
            href={href}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold px-4 py-3 rounded-xl shadow text-center transition mb-4"
        >
            {label}
        </Link>
    );
};
