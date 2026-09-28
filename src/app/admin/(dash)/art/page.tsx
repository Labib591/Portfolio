import { getArt } from "@/lib/db";
import { storageReady } from "@/lib/storage";
import { ArtUploader, ArtRow } from "./ArtForms";

/**
 * The photo-manipulation archive.
 *
 * Uploads go to Neon object storage, not the repo — there are a lot of these
 * and they are large, and committing them would make every clone and deploy
 * heavier forever.
 */
export default async function ArtAdmin() {
  const art = await getArt();

  return (
    <div>
      <h1 className="d-h3">art</h1>
      <p className="mt-3 max-w-[64ch] text-ui text-meta">
        the photo manipulation work from{" "}
        <span className="font-mono text-ink">@chitrok0r</span>. instagram blocks scraping
        without auth, so these are uploaded and hosted here — which also means you own
        them if the account ever goes.
      </p>

      {!storageReady ? (
        <p className="mt-8 text-ui text-signal-deep">
          object storage is not configured. add the S3_* keys to .env.local.
        </p>
      ) : (
        <section className="mt-10">
          <h2 className="meta">upload</h2>
          <ArtUploader />
        </section>
      )}

      <section className="mt-16">
        <h2 className="meta">{art.length} pieces</h2>

        {art.length === 0 ? (
          <p className="mt-5 text-ui text-meta italic">
            nothing uploaded yet. the archive section on the site stays hidden until there is.
          </p>
        ) : (
          <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {art.map((piece) => (
              <li key={piece.id}>
                <ArtRow piece={piece} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
