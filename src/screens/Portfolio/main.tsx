"use client"

import { PortfolioProvider } from "./providers"
import type { PortfolioProps } from "./types"
import { Fragment } from "react"

import { PageLayout } from "../../components/layout/PageLayout"
import { useRecruiterModeContext } from "../../providers/recruiterMode"
import { RecruiterContextPanel, RecommendationsPanel } from "../../features/recruiter"
import { SECTION_ORDER } from "@/constants/portfolio/sections"
import { AboutSection, BlogHighlightSection, CongratulationsSection, ExperiencesSection, ProjectsSection, SkillsSection, TestimonialsSection } from "./components"

const PortfolioInner = (props: PortfolioProps) => {
  const { isRecruiterMode } = useRecruiterModeContext()

  const sections = {
    about: <AboutSection className="pt-4 lg:pt-28" metrics={props.metrics} />,
    refinement: <><RecruiterContextPanel /><RecommendationsPanel recommendations={props.recommendations} /></>,
    skills: <SkillsSection />,
    blog: <BlogHighlightSection post={props.featuredBlogPost} />,
    projects: <ProjectsSection />,
    experiences: <ExperiencesSection />,
    testimonials: <TestimonialsSection feedbacks={props.feedbacks} />,
    feedback: (
      <CongratulationsSection
        className="pb-28"
        initialLiked={props.metrics.liked}
        feedbacks={props.portfolioFeedbacks}
      />
    ),
  }

  const sectionOrder = SECTION_ORDER[isRecruiterMode ? "recruiter" : "default"]

  return (
    <PageLayout hasAdminSession={props.hasAdminSession}>
      {sectionOrder.map((section) => (
        <Fragment key={section}>
          {sections[section]}
        </Fragment>
      ))}
    </PageLayout>
  )
}

export const Portfolio = (props: PortfolioProps) => {
  return (
    <PortfolioProvider>
      <PortfolioInner {...props} />
    </PortfolioProvider>
  )
}
