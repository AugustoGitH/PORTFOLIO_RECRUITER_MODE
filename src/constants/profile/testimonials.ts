import type { Image } from "../../utils/types"
import { ENTERPRISE } from "./experiences"


export type Testimonial = {
  value: string
  enterprise: {
    name?: string
    image?: Image
  }
  description: string
  author: {
    name: string
    position?: string
    image?: Image
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
        src: "/assets/testimunials/leo.jpg",
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
        src: "/assets/testimunials/emanuel.jpg",
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
        src: "/assets/testimunials/italo.jpg",
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
        src: "/assets/testimunials/samir.jpg",
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
        src: "/assets/testimunials/warllei.jpg",
        alt: "Warllei"
      }
    }
  }
]
