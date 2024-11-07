import { auth } from "@/app/auth";
import { SignIn, SignOut } from "@/components/auth-buttons";

export default async function UserButton() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <>
      <SignOut />
    </>
  );
}
