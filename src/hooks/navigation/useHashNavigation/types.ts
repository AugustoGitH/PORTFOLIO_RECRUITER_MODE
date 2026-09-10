export type HashNavigationOutput= {
  handleAnchorClick: (href: string) => (event: React.MouseEvent) => void
  activeHref?: string
}
