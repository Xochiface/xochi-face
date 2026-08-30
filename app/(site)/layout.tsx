import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

/**
 * Chrome for the public site. The styleguide sits outside this group so it
 * renders without header or footer.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
