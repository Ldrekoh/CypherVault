import { SignOutButton } from '@/components/forms/auth/signout';

const Page = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignOutButton />
      </div>
    </div>
  );
};

export default Page;
