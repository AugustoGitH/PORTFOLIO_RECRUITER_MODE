import { ArrowRightIcon } from "lucide-react"
import { Chip } from "../../../../../../components/action/Chip"
import { ResponsiveAsciiArt } from "../../../../../../components/general/AsciiArt"
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
          <nav className="flex shrink-0 items-center gap-1" aria-label={`${intl.t("ViewProject")}: ${project.title}`}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                aria-label={link.title}
                className="flex size-11 items-center justify-center rounded-md text-ud-neutral-950 transition-colors hover:bg-ud-auxiliary-purple-light hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
              >
                {link.icon && <link.icon aria-hidden="true" size={featured ? 17 : 15} />}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className={cn("mt-1 flex items-center gap-2 text-ud-neutral-950", featured && "mt-3")}>
        {project.icon && <project.icon aria-hidden="true" size={featured ? 25 : 19} />}
        <h3 className={cn("font-bold leading-tight", featured ? "text-xl" : "text-sm")}>{project.title}</h3>
      </div>

      {project.description && (
        <p
          className={cn("mt-1 text-xs leading-snug text-ud-neutral-900", featured && "mt-4 text-sm leading-relaxed")}
          dangerouslySetInnerHTML={{ __html: intl.t(project.description) }}
        />
      )}

      {featured && (
        <div className="mt-auto flex items-end justify-between gap-2 pt-3 md:min-h-28">
          {projectLink && (
            <a
              href={projectLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md px-3 text-xs font-semibold text-ud-auxiliary-purple hover:bg-ud-auxiliary-purple-light hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
            >
              {intl.t("ViewProject")}
              <ArrowRightIcon aria-hidden="true" size={15} />
            </a>
          )}
          <ResponsiveAsciiArt
            src="/assets/projects/growth-chart.svg"
            alt=""
            initialWidth={208}
            columns={76}
            rows={24}
            wrapperClassName="hidden w-52 max-w-full shrink-0 overflow-hidden md:flex"
          />
        </div>
      )}
    </article>
  )
}
