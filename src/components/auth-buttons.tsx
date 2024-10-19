"use server";

import { signIn, signOut } from "@/app/auth";
import { Button } from "@/components/ui/button";

export async function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("dex");
      }}
    >
      <Button size="xs" {...props}>
        Log in
      </Button>
    </form>
  );
}

export async function SignOut(
  props: React.ComponentPropsWithRef<typeof Button>,
) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button size="xs" {...props}>
        Log out
      </Button>
    </form>
  );
}
