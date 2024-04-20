import HtmlEditor from "@/components/html-editor";
import { Toaster } from "sonner";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <HtmlEditor id={params.slug}/>
      <Toaster />
    </>
  );
}
