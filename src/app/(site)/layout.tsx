import { Chrome } from "@/components/Chrome";
import { Scroll } from "@/components/Scroll";

/**
 * The public site's shell.
 *
 * Lives in a route group so /admin does not inherit it. The admin is a tool:
 * it must not get fixed corner labels over its forms, and it certainly must not
 * get Lenis, which would hijack scrolling inside a long edit list.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Chrome />
      <Scroll>{children}</Scroll>
    </>
  );
}
