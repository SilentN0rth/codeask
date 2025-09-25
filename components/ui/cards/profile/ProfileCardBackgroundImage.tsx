import SafeImage from '@/components/ui/SafeImage';

export default function ProfileCardBackgroundImage({
  backgroundUrl,
}: {
  backgroundUrl: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden max-sm:flex">
      <SafeImage
        alt="Tło użytkownika"
        src={backgroundUrl}
        classNames={{
          img: 'w-full h-full object-cover',
          wrapper: '!max-w-full w-full h-full opacity-20',
        }}
        timeout={5000}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cBgDark-800/100 to-cBgDark-800/5" />
    </div>
  );
}
