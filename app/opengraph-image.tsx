import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Taban Niroo · High-Voltage Composite Insulators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image for the home/social card.
 *
 * Brand-rooted instead of a generic gradient block: a deep night-sky
 * background, a single voltage hairline, the company name in a heavy
 * editorial cut, and a small "DPL · Since 1997" mono caps line. Renders
 * on the edge so it costs nothing in cold-start latency.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(120% 80% at 70% -10%, rgba(56,189,248,0.18), rgba(0,0,0,0)) , linear-gradient(180deg, #050810 0%, #0a0d18 100%)",
          color: "#fafafa",
          padding: "84px 96px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "9999px",
              background: "#7dd3fc",
              boxShadow: "0 0 16px rgba(125,211,252,0.65)",
            }}
          />
          DPL · Since 1997
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
            }}
          >
            High-voltage
            <br />
            composite insulators.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
            }}
          >
            6-1000 kV · IEC-tested · Shiraz, Iran
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 88,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(125,211,252,0.6), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 56,
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>Taban Niroo</span>
          <span>taban-niroo.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
