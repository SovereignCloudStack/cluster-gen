import { Navbar } from "@/components/navbar";
import UserButton from "@/components/user-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b transition-colors border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Navbar>{/*<UserButton />*/}</Navbar>
    </header>
  );
}
