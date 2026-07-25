import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { BiasMeter } from "@/components/ui/bias-meter";
import { NewsCard } from "@/components/ui/news-card";
import {
  Menu,
  Search,
  Share2,
  Bookmark,
  Bell,
  ArrowUpRight,
  Download,
  ExternalLink,
  Calendar,
  Tag,
  Filter,
  ChevronRight,
  CheckCircle,
  MoreHorizontal,
  Info,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[var(--surface)] min-h-screen flex flex-col">
      {/* ─── Main content ─── */}
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-6 py-6 flex flex-col gap-5">
        {/* ════════════════════════════════
            Row 1: Brand · Typography · UI
            ════════════════════════════════ */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr 340px" }}>
          {/* ── Brand ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-6 flex flex-col">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Brand
            </span>
            <div className="flex-1 flex flex-col items-center justify-center gap-1 py-4">
              <h2 className="text-[40px] font-bold tracking-[-0.02em] text-[var(--text-primary)] leading-none">
                biasly
              </h2>
              <span className="text-[15px] font-medium text-[var(--text-secondary)] -mt-0.5">
                News
              </span>
              <p className="text-[13px] text-[var(--text-secondary)] text-center mt-4 leading-relaxed">
                Balanced news coverage,
                <br />
                powered by AI.
              </p>
            </div>
          </section>

          {/* ── Typography ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-6 overflow-hidden">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Typography
            </span>

            <div className="mt-3 flex gap-5">
              {/* Left: Font specimen */}
              <div className="shrink-0 w-[180px]">
                <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em]">
                  Font Family
                </p>
                <p className="text-[42px] font-bold text-[var(--text-primary)] leading-[1.1] mt-1">
                  Poppins
                </p>
                <p className="text-[12px] text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Poppins is a modern geometric sans-serif typeface that ensures
                  clarity and excellent readability.
                </p>
              </div>

              {/* Right: Type scale table */}
              <div className="flex-1 min-w-0">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em]">
                      <th className="text-left pb-2 pr-3 font-semibold">Style</th>
                      <th className="text-left pb-2 pr-3 font-semibold w-[120px]"></th>
                      <th className="text-left pb-2 pr-3 font-semibold">Size</th>
                      <th className="text-left pb-2 pr-3 font-semibold">Weight</th>
                      <th className="text-left pb-2 font-semibold">Line Height</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-primary)]">
                    <TypeRow style="H1" size="32px" weight="Bold" lh="1.2" fontSize={28} fontWeight={700} usage="Page / Screen Title" />
                    <TypeRow style="H2" size="24px" weight="SemiBold" lh="1.3" fontSize={21} fontWeight={600} usage="Section Title" />
                    <TypeRow style="H3" size="20px" weight="SemiBold" lh="1.3" fontSize={17} fontWeight={600} usage="Card / Module Title" />
                    <TypeRow style="H4" size="16px" weight="Medium" lh="1.4" fontSize={14} fontWeight={500} usage="Subheading" />
                    <TypeRow style="Body Large" size="16px" weight="Regular" lh="1.6" fontSize={13} fontWeight={400} usage="Important content" />
                    <TypeRow style="Body Medium" size="14px" weight="Regular" lh="1.6" fontSize={12} fontWeight={400} usage="Body text" />
                    <TypeRow style="Body Small" size="13px" weight="Regular" lh="1.6" fontSize={11} fontWeight={400} usage="Supporting text" />
                    <TypeRow style="Caption" size="11px" weight="Regular" lh="1.4" fontSize={10} fontWeight={400} usage="Labels, meta text" />
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── UI Elements ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5 flex flex-col gap-4 overflow-hidden">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              UI Elements
            </span>

            {/* Buttons */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mb-2">
                Buttons
              </p>
              {/* Column headers */}
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_1fr] gap-1 items-center mb-1">
                <div />
                <span className="text-[9px] text-[var(--text-secondary)] text-center">Default</span>
                <span className="text-[9px] text-[var(--text-secondary)] text-center">Hover</span>
                <span className="text-[9px] text-[var(--text-secondary)] text-center">Outline</span>
                <span className="text-[9px] text-[var(--text-secondary)] text-center">Disabled</span>
              </div>
              {/* Primary row */}
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_1fr] gap-1 items-center mb-1">
                <span className="text-[10px] text-[var(--text-secondary)]">Primary</span>
                <div className="flex justify-center"><Button variant="primary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="primary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)] !bg-[var(--btn-primary-hover)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="outline" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="primary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]" disabled>Button</Button></div>
              </div>
              {/* Secondary row */}
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_1fr] gap-1 items-center mb-1">
                <span className="text-[10px] text-[var(--text-secondary)]">Secondary</span>
                <div className="flex justify-center"><Button variant="secondary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="secondary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)] !bg-[var(--bg-secondary)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="outline" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]">Button</Button></div>
                <div className="flex justify-center"><Button variant="secondary" className="!text-[11px] !px-2 !py-1 h-auto !rounded-[var(--radius-sm)]" disabled>Button</Button></div>
              </div>
              {/* Text row */}
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_1fr] gap-1 items-center">
                <span className="text-[10px] text-[var(--text-secondary)]">Text</span>
                <div className="flex justify-center"><Button variant="text" className="!text-[11px] h-auto">Button</Button></div>
                <div className="flex justify-center"><Button variant="text" className="!text-[11px] h-auto underline">Button</Button></div>
                <span className="text-center text-[var(--text-secondary)] text-[11px]">—</span>
                <span className="text-center text-[var(--text-secondary)] text-[12px]">—</span>
              </div>
            </div>

            {/* Chips */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mb-2">
                Chip / Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Chip label="World Cup" />
                <Chip label="IPL" />
                <Chip label="Business & Markets" />
                <Chip label="More" />
              </div>
            </div>

            {/* Bias Meter */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mb-2">
                Bias Meter
              </p>
              <BiasMeter left={25} center={50} right={25} />
            </div>
          </section>
        </div>

        {/* ════════════════════════════════
            Row 2: Colors · Icons · Card
            ════════════════════════════════ */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr 380px" }}>
          {/* ── Colors ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Colors
            </span>

            {/* Primary */}
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mt-4 mb-2">
              Primary
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <Swatch color="#0D0D0F" label="Text Primary" hex="#0D0D0F" />
              <Swatch color="#6B7280" label="Text Secondary" hex="#6B7280" />
              <Swatch color="#F6F6F6" label="Surface" hex="#F6F6F6" border />
            </div>

            {/* Semantic */}
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mt-4 mb-2">
              Semantic
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <Swatch color="#B42318" label="Left Bias" hex="#B42318" />
              <Swatch color="#6E6E7B" label="Center" hex="#6E6E7B" />
              <Swatch color="#1D4ED8" label="Right Bias" hex="#1D4ED8" />
            </div>

            {/* Neutrals */}
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.06em] mt-4 mb-2">
              Neutrals
            </p>
            <div className="grid grid-cols-4 gap-2">
              <Swatch color="#FFFFFF" label="BG Primary" hex="#FFFFFF" border />
              <Swatch color="#F0F0F0" label="BG Secondary" hex="#F0F0F0" border />
              <Swatch color="#E5E7EB" label="Border" hex="#E5E7EB" border />
              <Swatch color="#E5E7EB" label="Divider" hex="#E5E7EB" border />
            </div>
          </section>

          {/* ── Icons ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Icons
            </span>

            <div className="grid grid-cols-6 gap-5 mt-5 text-[var(--text-primary)]">
              <IconCell><Menu size={22} strokeWidth={2} /></IconCell>
              <IconCell><Search size={22} strokeWidth={2} /></IconCell>
              <IconCell><Share2 size={22} strokeWidth={2} /></IconCell>
              <IconCell><Bookmark size={22} strokeWidth={2} /></IconCell>
              <IconCell><Bell size={22} strokeWidth={2} /></IconCell>
              <IconCell><ArrowUpRight size={22} strokeWidth={2} /></IconCell>
              <IconCell><Download size={22} strokeWidth={2} /></IconCell>
              <IconCell><ExternalLink size={22} strokeWidth={2} /></IconCell>
              <IconCell><Calendar size={22} strokeWidth={2} /></IconCell>
              <IconCell><Tag size={22} strokeWidth={2} /></IconCell>
              <IconCell><Filter size={22} strokeWidth={2} /></IconCell>
              <IconCell><ChevronRight size={22} strokeWidth={2} /></IconCell>
              <IconCell><Info size={22} strokeWidth={2} /></IconCell>
              <IconCell><CheckCircle size={22} strokeWidth={2} /></IconCell>
              <IconCell><MoreHorizontal size={22} strokeWidth={2} /></IconCell>
            </div>

            <p className="text-[12px] text-[var(--text-secondary)] mt-5">
              Line style · 2px stroke · Rounded caps
            </p>
          </section>

          {/* ── Card Example ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Card Example
            </span>
            <div className="mt-3">
              <NewsCard
                image="/sample-news.png"
                category="Politics"
                source="United States"
                title="Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report"
                description="The proposal includes stricter limits on uranium enrichment and enhanced verification measures."
                left={26}
                center={50}
                right={49}
                timeAgo="2h ago"
                readTime="12 min read"
              />
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════
            Row 3: Spacing · Grid · Shadows · Radius
            ════════════════════════════════════════ */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr 200px 200px" }}>
          {/* ── Spacing System ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
                Spacing System
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">(4px base unit)</span>
            </div>

            <div className="flex items-end gap-2 mt-5 mb-3" style={{ height: 80 }}>
              <SpacingBar size={4} maxH={80} />
              <SpacingBar size={8} maxH={80} />
              <SpacingBar size={16} maxH={80} />
              <SpacingBar size={24} maxH={80} />
              <SpacingBar size={32} maxH={80} />
              <SpacingBar size={40} maxH={80} />
              <SpacingBar size={64} maxH={80} />
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Consistent spacing scale based on 4px base unit
            </p>
          </section>

          {/* ── Grid System ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Grid System
            </span>

            <div className="flex gap-5 mt-4">
              {/* Visual columns */}
              <div className="flex-1 flex gap-[3px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[3px]"
                    style={{
                      height: 90,
                      backgroundColor: i % 2 === 0 ? "#C4B5A6" : "#A7BBC7",
                      opacity: 0.45,
                    }}
                  />
                ))}
              </div>

              {/* Specs */}
              <div className="shrink-0 w-[90px] flex flex-col gap-2.5">
                <GridSpec label="Container" value="1280px" />
                <GridSpec label="Columns" value="12" />
                <GridSpec label="Gutter" value="24px" />
                <GridSpec label="Margin" value="24px" />
              </div>
            </div>
          </section>

          {/* ── Shadows ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Shadows
            </span>
            <div className="flex flex-col gap-4 mt-4">
              <ShadowSample label="Small" value="0px 1px 2px rgba(0,0,0,0.05)" shadow="var(--shadow-sm)" />
              <ShadowSample label="Medium" value="0px 4px 12px rgba(0,0,0,0.08)" shadow="var(--shadow-md)" />
              <ShadowSample label="Large" value="0px 12px 24px rgba(0,0,0,0.12)" shadow="var(--shadow-lg)" />
            </div>
          </section>

          {/* ── Border Radius ── */}
          <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-color)] p-5">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.12em]">
              Border Radius
            </span>
            <div className="flex flex-col gap-3.5 mt-4">
              <RadiusSample label="Small" value="4px" radius="var(--radius-sm)" />
              <RadiusSample label="Medium" value="8px" radius="var(--radius-md)" />
              <RadiusSample label="Large" value="12px" radius="var(--radius-lg)" />
              <RadiusSample label="Full" value="9999px" radius="var(--radius-full)" />
            </div>
          </section>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-[var(--text-primary)] text-white mt-auto">
        <div className="max-w-[1320px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] font-bold leading-none">biasly</span>
              <span className="text-[11px] opacity-50 mt-0.5">News</span>
            </div>
            <span className="text-[12px] opacity-50">
              Balanced news coverage, powered by AI.
            </span>
          </div>
          <span className="text-[12px] opacity-50">Design System v1.0 &nbsp;&nbsp; June 1, 2026</span>
          <span className="text-[13px] font-medium italic">Stay consistent. Stay unbiased.</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Helper components (server-side, no interactivity) ── */

function TypeRow({
  style,
  usage,
  size,
  weight,
  lh,
  fontSize,
  fontWeight,
}: {
  style: string;
  usage: string;
  size: string;
  weight: string;
  lh: string;
  fontSize: number;
  fontWeight: number;
}) {
  return (
    <tr className="border-b border-[var(--border-color)] last:border-b-0">
      <td className="py-1.5 pr-3">
        <span style={{ fontSize, fontWeight }} className="text-[var(--text-primary)] leading-none whitespace-nowrap">
          {style}
        </span>
      </td>
      <td className="py-1.5 pr-3 text-[var(--text-secondary)] text-[11px]">{usage}</td>
      <td className="py-1.5 pr-3 text-[11px]">{size}</td>
      <td className="py-1.5 pr-3 text-[11px]">{weight}</td>
      <td className="py-1.5 text-[11px]">{lh}</td>
    </tr>
  );
}

function Swatch({
  color,
  label,
  hex,
  border,
}: {
  color: string;
  label: string;
  hex: string;
  border?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="w-full aspect-square rounded-[var(--radius-md)]"
        style={{
          backgroundColor: color,
          border: border ? "1px solid var(--border-color)" : "none",
        }}
      />
      <span className="text-[9px] text-[var(--text-secondary)] uppercase font-semibold leading-tight mt-0.5">
        {label}
      </span>
      <span className="text-[9px] text-[var(--text-secondary)]">{hex}</span>
    </div>
  );
}

function IconCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
      {children}
    </div>
  );
}

function SpacingBar({ size, maxH }: { size: number; maxH: number }) {
  const height = Math.max((size / 64) * maxH, 4);
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div
        className="w-full rounded-[3px]"
        style={{
          height,
          background: `linear-gradient(180deg, #A7BBC7 0%, #7A9AAD 100%)`,
        }}
      />
      <span className="text-[10px] text-[var(--text-secondary)]">{size}px</span>
    </div>
  );
}

function GridSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--text-secondary)]">{label}</p>
      <p className="text-[13px] font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function ShadowSample({
  label,
  value,
  shadow,
}: {
  label: string;
  value: string;
  shadow: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-[var(--radius-md)] bg-white shrink-0 border border-[var(--border-color)]/30"
        style={{ boxShadow: shadow }}
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase text-[var(--text-primary)]">{label}</p>
        <p className="text-[9px] text-[var(--text-secondary)] leading-tight break-all">{value}</p>
      </div>
    </div>
  );
}

function RadiusSample({
  label,
  value,
  radius,
}: {
  label: string;
  value: string;
  radius: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] shrink-0"
        style={{ borderRadius: radius }}
      />
      <div className="flex items-baseline gap-2">
        <p className="text-[11px] font-semibold uppercase text-[var(--text-primary)]">{label}</p>
        <p className="text-[11px] text-[var(--text-secondary)]">{value}</p>
      </div>
    </div>
  );
}