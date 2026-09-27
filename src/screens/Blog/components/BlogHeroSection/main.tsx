"use client"

import { AsciiArt } from "@/components/general/AsciiArt"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { useBlogContext } from "../../providers"

const readingOptions = [2, 5, 10] as const

export const BlogHeroSection = () => {
  const intl = useINTLContext()
  const { readingLimit, setReadingLimit } = useBlogContext()

  return (
    <Container
      className="portfolio-hero bg-ud-neutral-100 pb-7 pt-10 text-ud-neutral-999"
      contentClassName="max-w-[72rem]"
    >
      <div className="grid min-h-72 items-center gap-7 md:grid-cols-[1fr_0.95fr]">
        <div className="relative z-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ud-auxiliary-purple">{intl.t("Blog")}</p>
          <h1 className="max-w-[560px] text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-ud-neutral-999 sm:text-5xl lg:text-[3.6rem]">
            {intl.t("BlogHeroTitleFirst")}<br />{intl.t("BlogHeroTitleSecond")}
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-ud-secondary-600 sm:text-lg">{intl.t("BlogHeroDescription")}</p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={intl.t("BlogReadingTimeFilter")}>
            {readingOptions.map((minutes) => (
              <button
                key={minutes}
                type="button"
                aria-pressed={readingLimit === minutes}
                onClick={() => setReadingLimit(minutes)}
                className={`min-w-20 rounded border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple ${readingLimit === minutes ? "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-white" : "border-ud-neutral-300 bg-white hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple"}`}
              >
                {intl.t("BlogMinutesOption", { minutes })}
              </button>
            ))}
          </div>
        </div>
        <div className="relative hidden min-h-72 items-end justify-center md:flex">
          <AsciiArt src="/assets/blog/hero-developer.png" alt={intl.t("BlogHeroArtAlt")} width={420} columns={112} rows={45} />
        </div>
      </div>
    </Container>
  )
}
