import { ArrowRightIcon } from "lucide-react"
import { Chip } from "../../../../../../components/action/Chip"
import { ProjectKind } from "../../../../../../constants/profile"
import type { Term } from "../../../../../../constants/intl"
import { useINTLContext } from "../../../../../../providers/intl"
import { cn } from "../../../../../../utils/tailwind"
import type { ProjectCardProps } from "./types"

const PROJECT_KIND_TERM: Record<Exclude<ProjectKind, ProjectKind.All>, Term> = {
  [ProjectKind.Professional]: "Professional",
  [ProjectKind.Volunteer]: "VolunteerProjectCategory",
  [ProjectKind.Personal]: "Personal",
}

const GrowthArtwork = () => (
  <svg
    aria-hidden="true"
    className="h-auto w-52 max-w-full text-ud-neutral-950"
    viewBox="0 0 220 110"
    fill="none"
  >
    <ellipse cx="110" cy="103" rx="77" ry="7" fill="#e7e1ff" />
    <path d="M38 94H177" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
    <path d="M51 92V75H68V92M81 92V63H98V92M111 92V48H128V92M141 92V31H158V92" stroke="currentColor" strokeWidth="4" strokeLinejoin="miter" />
    <path d="M39 70C75 60 118 42 170 13" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" />
    <path d="M156 12L174 10L170 28" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M182 37L190 30M197 49L207 45M169 44L175 38" className="text-ud-auxiliary-purple" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
  </svg>
)

export const ProjectCard = ({ project, featured = false, className, style }: ProjectCardProps) => {
  const intl = useINTLContext()
  const projectLink = project.links?.[0]

  return (
    <article
      id={`project-${project.value}`}
      style={style}
      className={cn(
        "relative flex min-w-0 flex-col rounded-md border border-ud-neutral-300 bg-ud-neutral-100 p-3",
        featured && "min-h-72 border-ud-auxiliary-purple/20 bg-ud-auxiliary-purple-light/50 p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Chip size="sm">{intl.t(PROJECT_KIND_TERM[project.kind])}</Chip>
        {project.links && project.links.length > 0 && (
          <nav className="flex shrink-0 items-center gap-2" aria-label={`${intl.t("ViewProject")}: ${project.title}`}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                aria-label={link.title}
                className="text-ud-neutral-950 transition-colors hover:text-ud-auxiliary-purple"
              >
                {link.icon && <link.icon size={featured ? 17 : 15} />}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className={cn("mt-1 flex items-center gap-2 text-ud-neutral-950", featured && "mt-3")}>
        {project.icon && <project.icon size={featured ? 25 : 19} />}
        <h3 className={cn("font-bold leading-tight", featured ? "text-xl" : "text-sm")}>{project.title}</h3>
      </div>

      {project.description && (
        <p
          className={cn("mt-1 text-xs leading-snug text-ud-neutral-900", featured && "mt-4 text-sm leading-relaxed")}
          dangerouslySetInnerHTML={{ __html: intl.t(project.description) }}
        />
      )}

      {featured && (
        <div className="mt-auto flex min-h-28 items-end justify-between gap-2 pt-3">
          {projectLink && (
            <a
              href={projectLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ud-auxiliary-purple hover:underline"
            >
              {intl.t("ViewProject")}
              <ArrowRightIcon size={15} />
            </a>
          )}
          <GrowthArtwork />
        </div>
      )}
    </article>
  )
}
