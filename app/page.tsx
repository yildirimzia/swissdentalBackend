import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  redirect("/create-page");
}
