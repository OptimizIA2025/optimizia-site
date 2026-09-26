// Applique l'ajout du premier article a site/blog/index.html.
// usage : node blog-transform.js <entree> <sortie>
const fs = require("fs");
const [src, out] = process.argv.slice(2);
let h = fs.readFileSync(src, "utf8");

function swap(from, to) {
  if (!h.includes(from)) throw new Error("introuvable : " + from.slice(0, 80));
  h = h.split(from).join(to);
}

const OLD_DESC = "Articles on custom AI automation for small and mid-size businesses, by OptimizIA.xyz. The first ones are on their way.";
const NEW_DESC = "Practical articles on custom AI automation for small and mid-size businesses, by OptimizIA.xyz: what we build, what breaks, and how we keep it running.";

swap('    <meta name="robots" content="noindex, follow">\n', "");
swap(OLD_DESC, NEW_DESC);

swap(`          "inLanguage": "en",
          "isPartOf": {`, `          "inLanguage": "en",
          "blogPost": [
            {
              "@type": "BlogPosting",
              "@id": "https://www.optimizia.xyz/blog/zapier-workflow-automation-tool/#article",
              "headline": "Zapier Workflow Automation Tool: Build Reliable Automations Without the Busywork",
              "url": "https://www.optimizia.xyz/blog/zapier-workflow-automation-tool/",
              "datePublished": "2026-09-26"
            }
          ],
          "isPartOf": {`);

swap(`    <style>.post-head .lead a { color: var(--orange-deep); text-decoration: underline; text-underline-offset: 2px; }</style>`,
`    <style>
    .post-head .lead a { color: var(--orange-deep); text-decoration: underline; text-underline-offset: 2px; }
    .blog-card-art img { display: block; width: 100%; height: auto; }
    .blog-grid.is-featured > .blog-card:first-child { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 11fr) minmax(0, 9fr); column-gap: 36px; align-content: center; padding: 28px; }
    .blog-grid.is-featured > .blog-card:first-child > .blog-card-art { grid-column: 1; grid-row: 1 / span 4; margin: 0; align-self: center; }
    .blog-grid.is-featured > .blog-card:first-child > :not(.blog-card-art) { grid-column: 2; }
    .blog-grid.is-featured > .blog-card:first-child > .blog-card-tag { align-self: end; }
    .blog-grid.is-featured > .blog-card:first-child h2 { font-size: clamp(1.4rem, 2.4vw, 1.9rem); letter-spacing: -0.025em; line-height: 1.2; }
    .blog-grid.is-featured > .blog-card:first-child p { flex: none; font-size: .98rem; }
    @media (max-width: 800px) {
      .blog-grid.is-featured > .blog-card:first-child { display: flex; padding: 24px; }
      .blog-grid.is-featured > .blog-card:first-child > .blog-card-art { margin: -6px 0 16px; }
    }
    </style>`);

swap(`<p class="lead">Our first articles are on their way. In the meantime, our <a href="/case-studies/">case studies</a> show what we build for small and mid-size businesses, and what it changes day to day.</p>
        </div>`,
`<p class="lead">Practical articles on automating the repetitive work of small and mid-size businesses. Our <a href="/case-studies/">case studies</a> show what we build, and what it changes day to day.</p>
        </div>

        <div class="blog-grid is-featured">
          <a class="blog-card" href="/blog/zapier-workflow-automation-tool/">
            <div class="blog-card-art"><img src="/assets/blog/zapier-workflow-automation-tool.webp" alt="" width="1200" height="630"></div>
            <span class="blog-card-tag">Automation</span>
            <h2>Zapier Workflow Automation Tool: Build Reliable Automations Without the Busywork</h2>
            <p>How we map your process before touching Zapier, the four safeguards on every Zap we hand over, what it costs, and when n8n or Make is the better call.</p>
            <span class="blog-card-time"><img class="blog-card-avatar" src="/avis-pics/romainBen.webp" alt="" width="30" height="30" loading="lazy"><b>Romain Ben</b><time datetime="2026-09-26">September 26, 2026</time></span>
          </a>
        </div>`);

swap(`<!-- Mesure d'audience.`, `<script>
/* Les dates des cartes suivent la langue affichee : oia-i18n.js n'indexe pas les <time>. */
document.addEventListener("oia:lang", function (e) {
    var fmt = new Intl.DateTimeFormat(e.detail || "en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    document.querySelectorAll(".blog-card time[datetime]").forEach(function (t) {
        t.textContent = fmt.format(new Date(t.getAttribute("datetime") + "T00:00:00Z"));
    });
});
</script>

<!-- Mesure d'audience.`);

fs.writeFileSync(out, h);
console.log("ok", out);
