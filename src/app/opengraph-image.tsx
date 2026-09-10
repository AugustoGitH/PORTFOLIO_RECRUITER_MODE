import { ImageResponse } from "next/og"

export const alt = "Augusto Westphal, desenvolvedor web full stack"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #120b21 0%, #2b1353 52%, #120b21 100%)",
          color: "#ffffff",
          display: "flex",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#863bff",
            borderRadius: "999px",
            height: "440px",
            opacity: 0.35,
            position: "absolute",
            right: "-100px",
            top: "-150px",
            width: "440px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "920px" }}>
          <div style={{ color: "#c7a6ff", display: "flex", fontSize: "28px", fontWeight: 700 }}>
            PORTFÓLIO
          </div>
          <div style={{ display: "flex", fontSize: "74px", fontWeight: 800, letterSpacing: "-3px" }}>
            Augusto Westphal
          </div>
          <div style={{ color: "#e5dcfa", display: "flex", fontSize: "34px" }}>
            Desenvolvedor Web Full Stack
          </div>
        </div>
      </div>
    ),
    size,
  )
}
