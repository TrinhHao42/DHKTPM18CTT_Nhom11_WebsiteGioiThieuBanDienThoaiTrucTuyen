import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enternal Rune SignIn Page | Dashboard Admin",
  description: "SignIn to access the Enternal Rune Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
