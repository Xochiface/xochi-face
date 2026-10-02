import { EditMode } from "@/components/edit-mode/edit-mode";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

/**
 * Chrome for the public site. The styleguide sits outside this group so it
 * renders without header or footer.
 *
 * EditMode is the private edit toolbar — visible when running locally,
 * hidden on the live site unless switched on with ?xochi-edit. See EDITING.md.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <EditMode />
    </>
  );
}
