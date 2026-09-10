export type Image = {
  src: string,
  alt: string
}


export type Link = {
    icon?: React.ComponentType<{
    size?: number;
}>,
iconOnly?: boolean
        title: string,
        href: string
}