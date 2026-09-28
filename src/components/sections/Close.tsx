import { Reveal } from "@/components/Reveal";
import { profile } from "@/content/profile";

/**
 * The close.
 *
 * A scroll needs an anchor at the bottom or it just stops. This is the only
 * place on the site with a direct address to the reader, and the email is set
 * at display scale because it is the one thing worth acting on.
 */
export function Close() {
  return (
    <section
      className="gutter flex min-h-[86vh] flex-col justify-between py-[clamp(90px,14vh,170px)]"
      aria-label="contact"
    >
      <Reveal className="flex items-baseline gap-4">
        <h2 className="meta">06 — end</h2>
        <span className="meta">newark / dhaka</span>
      </Reveal>

      <Reveal className="mt-16">
        <p className="d-h2 max-w-[18ch]">building something? tell me about it.</p>

        <a
          href={`mailto:${profile.contact.email}`}
          className="group mt-12 inline-flex items-baseline gap-4"
        >
          <span className="d-h3 border-b border-ink/25 transition-colors group-hover:border-ink">
            {profile.contact.email}
          </span>
          <span className="text-h3 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </Reveal>

      <Reveal className="mt-20 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-t border-bone-lo pt-6">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {profile.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="meta transition-colors hover:text-ink"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="meta transition-colors hover:text-ink"
            >
              whatsapp ↗
            </a>
          </li>
        </ul>

        <span className="meta">
          © {new Date().getFullYear()} {profile.name}
        </span>
      </Reveal>
    </section>
  );
}
