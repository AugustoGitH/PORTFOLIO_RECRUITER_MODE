import { Footer } from "../Footer";
import { Header } from "../Header";
import type { PageLayoutProps } from "./types";

export const PageLayout = (props: PageLayoutProps) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  )
}