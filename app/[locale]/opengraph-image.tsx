import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Cornerstone Develop — Software, datos y ciberseguridad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const mark = await readFile(join(process.cwd(), "public/brand/cornerstone-mark-white.svg"));
  const markSrc = `data:image/svg+xml;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#050807",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={115} height={72} alt="" />
          <div style={{ fontSize: 44, letterSpacing: "-0.04em" }}>Cornerstone Develop</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: "-0.06em" }}>{t("title1")}</div>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: "-0.06em", color: "#f2c230" }}>{t("title2")}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
          <span>{t("kicker")}</span>
          <span>{t("city")}</span>
        </div>
      </div>
    ),
    size
  );
}
