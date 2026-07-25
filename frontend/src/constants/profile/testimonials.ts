import type { Image } from "../../utils/types"
import type { Term } from "../intl"
import { ENTERPRISE } from "./experiences"


export type Testimonial = {
  value: string
  enterprise: {
    name: string
    image: Image
  }
  description: Term
  author: {
    name: string
    position: Term
    image: Image
  }
}


export const TESTIMONIALS: Testimonial[] = [
  {
    value: "leonardo",
    enterprise: {
      name: ENTERPRISE.techLegion.title,
      image: ENTERPRISE.techLegion.image
    },
    description:
      "TestimonialLeo",
    author: {
      name: "Leonardo",
      position: "TechLegionCEO",
      image: {
        src: "https://media.licdn.com/dms/image/v2/D4D03AQFYQA85SBLsjw/profile-displayphoto-crop_800_800/B4DZ.GL6OlJAAI-/0/1784662701061?e=1786579200&v=beta&t=EVh4gwX5Y3ajSMAD-K_aMdNsAc18XRWyPtKQB28f7Ow",
        alt: "Leonardo"
      }
    }
  },
  {
    value: "emanuel",
    enterprise: {
      name: ENTERPRISE.techLegion.title,
      image: ENTERPRISE.techLegion.image
    },
    description:
      "TestimonialEmanuel",
    author: {
      name: "Emanuel",
      position: "SoftwareDeveloper",
      image: {
        src: "https://media.licdn.com/dms/image/v2/D4D03AQFaTGgHu51fKg/profile-displayphoto-crop_800_800/B4DZnGvi2FIgAI-/0/1759975977190?e=1786579200&v=beta&t=gyrXnvBD4v7KpAw-6fe2plRbnZCpjXqlUAM51WkGkWM",
        alt: "Emanuel"
      }
    }
  },
  {
    value: "camilo-italo",
    enterprise: {
      name: ENTERPRISE.techLegion.title,
      image: ENTERPRISE.techLegion.image
    },
    description:
      "TestimonialItalo",
    author: {
      name: "Camilo Italo",
      position: "SoftwareDeveloper",
      image: {
        src: "https://media.licdn.com/dms/image/v2/D4E03AQHhYYbUA_GT3w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710360299210?e=1786579200&v=beta&t=To3zdU39RDnXO-Cdszex-0lgbhJBxF0U1HPbPMRiTbk",
        alt: "Camilo Italo"
      }
    }
  },
  {
    value: "samir",
    enterprise: {
      name: ENTERPRISE.drtSistemas.title,
      image: ENTERPRISE.drtSistemas.image
    },
    description:
      "TestimonialSamir",
    author: {
      name: "Samir",
      position: "FrontendWebDeveloper",
      image: {
        src: "https://media.licdn.com/dms/image/v2/D4E03AQEfCJW0CdpWvw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1701738465091?e=1786579200&v=beta&t=IFETWJKUP2IH_aSerhN5PtTyrv76Zv1MAH99C0ByAAA",
        alt: "Samir"
      }
    }
  },
  {
    value: "warllei",
    enterprise: {
      name: ENTERPRISE.drtSistemas.title,
      image: ENTERPRISE.drtSistemas.image
    },
    description:
      "TestimonialWarllei",
    author: {
      name: "Warllei",
      position: "FrontendWebDeveloper",
      image: {
        src: "https://media.licdn.com/dms/image/v2/D4D03AQG4B1sDKeiCjw/profile-displayphoto-shrink_800_800/B4DZUfXlfbHkAc-/0/1739988031888?e=1786579200&v=beta&t=RojeP1_yq2xIPsqjMT7LS_eXuBg2L6mmnhS7EgHMzcg",
        alt: "Samir"
      }
    }
  }
]