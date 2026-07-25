import { HamburgerIcon, MenuIcon } from "lucide-react"
import { Button } from "../../../../action/Button"

export const VerticalMenuButton = () => {
  return (
    <>
      <Button className="w-8 shrink-0 h-8 items-center justify-center">
        <MenuIcon size={20} />
      </Button>
    </>
  )
}