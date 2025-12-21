import HomePage from "@/components/home/HomePage";
import { Lang } from "@/lib/i18n";

export default function Page({
  params,
}: {
  params: { lang: Lang };
}) {
  return <HomePage lang={params.lang} />;
}
