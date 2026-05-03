import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevice, getDataPoint, severityConfig, trailNodeConfig, devices } from "@/lib/data";
import type { TrailNode } from "@/lib/data";

export function generateStaticParams() {
  return devices.flatMap((d) =>
    d.dataPoints.map((dp) => ({ slug: d.slug, dataId: dp.id }))
  );
}

function TrailCard({ node }: { node: TrailNode }) {
  const cfg = trailNodeConfig[node.type];
  return (
    <div className={`border p-4 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${cfg.color}`}>{cfg.label}</p>
      <p className="font-bold text-[#D4D4D4] text-sm">{node.name}</p>
      <p className="text-xs text-[#565656] mt-1 leading-relaxed">{node.description}</p>
      <p className="text-xs text-[#565656] mt-2 uppercase tracking-widest">{node.country}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-[#565656]" />
      <div className="text-[#565656] text-sm leading-none">↓</div>
    </div>
  );
}

export default async function DataTrailPage({
  params,
}: {
  params: Promise<{ slug: string; dataId: string }>;
}) {
  const { slug, dataId } = await params;
  const device = getDevice(slug);
  const dp = getDataPoint(slug, dataId);
  if (!device || !dp) notFound();

  const sev = severityConfig[dp.severity];
  const { trail } = dp;
  const allRecipients = [...trail.sharedWith, ...trail.soldTo];

  return (
    <main className="min-h-screen bg-black text-[#D4D4D4]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href={`/devices/${device.slug}`}
          className="text-xs text-[#565656] hover:text-[#D4D4D4] uppercase tracking-widest mb-10 inline-block transition-colors"
        >
          ← {device.name}
        </Link>

        {/* Header */}
        <div className="mb-10 border-b border-[#565656] pb-10">
          <p className="text-xs uppercase tracking-widest text-[#565656] mb-3">{device.name}</p>
          <h1 className="text-3xl font-bold text-[#D4D4D4] mb-3">{dp.name}</h1>
          <p className="text-[#565656] mb-5 leading-relaxed">{dp.description}</p>
          <span className={`text-xs font-bold px-3 py-1 border uppercase tracking-widest ${sev.bg} ${sev.color} ${sev.border}`}>
            {sev.label} severity
          </span>
        </div>

        {/* Examples */}
        <div className="mb-8 border border-[#565656] p-5">
          <p className="text-xs uppercase tracking-widest text-[#565656] mb-4">Examples of what is recorded</p>
          <ul className="flex flex-col gap-2">
            {dp.examples.map((ex) => (
              <li key={ex} className="flex items-start gap-3 text-sm text-[#D4D4D4]">
                <span className="text-[#A6151D] mt-0.5 shrink-0">—</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Incidents */}
        {dp.incidents && dp.incidents.length > 0 && (
          <div className="mb-8 border border-[#A6151D]/40 p-5">
            <p className="text-xs uppercase tracking-widest text-[#A6151D] mb-4">Known incidents</p>
            <div className="flex flex-col gap-5">
              {dp.incidents.map((incident) => (
                <div key={incident.title} className="border-l-2 border-[#A6151D] pl-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-[#A6151D] font-bold">{incident.year}</span>
                    <span className="text-sm font-bold text-[#D4D4D4]">{incident.title}</span>
                  </div>
                  <p className="text-sm text-[#565656] leading-relaxed">{incident.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Trail */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#565656] mb-6">Data trail — where it goes</p>

          <div className="border border-[#565656] p-4 text-center mb-1">
            <p className="text-xs uppercase tracking-widest text-[#565656] mb-1">Origin</p>
            <p className="text-base font-bold text-[#D4D4D4]">Your Home</p>
            <p className="text-xs text-[#565656] mt-1">{device.name} records this data</p>
          </div>

          <Arrow />

          <div className="mb-1">
            <p className="text-xs uppercase tracking-widest text-[#565656] mb-2">Step 1 — Collected by</p>
            <TrailCard node={trail.collectedBy} />
          </div>

          {trail.sharedWith.length > 0 && (
            <>
              <Arrow />
              <div className="mb-1">
                <p className="text-xs uppercase tracking-widest text-[#565656] mb-2">Step 2 — Shared internally with</p>
                <div className="flex flex-col gap-2">
                  {trail.sharedWith.map((n) => <TrailCard key={n.id} node={n} />)}
                </div>
              </div>
            </>
          )}

          {trail.soldTo.length > 0 && (
            <>
              <Arrow />
              <div className="mb-1">
                <p className="text-xs uppercase tracking-widest text-[#565656] mb-2">Step 3 — Sold or transferred to</p>
                <div className="flex flex-col gap-2">
                  {trail.soldTo.map((n) => <TrailCard key={n.id} node={n} />)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Used For */}
        <div className="mb-8 border border-[#565656] p-5">
          <p className="text-xs uppercase tracking-widest text-[#565656] mb-4">Used for</p>
          <ul className="flex flex-col gap-2">
            {trail.usedFor.map((use) => (
              <li key={use} className="flex items-start gap-3 text-sm text-[#D4D4D4]">
                <span className="text-[#A6151D] mt-0.5 shrink-0">—</span>
                {use}
              </li>
            ))}
          </ul>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-px bg-[#565656] mb-8">
          <div className="bg-black p-4 text-center">
            <p className="text-xs text-[#565656] uppercase tracking-widest mb-1">Retained</p>
            <p className="text-sm text-[#D4D4D4] font-bold">{trail.retentionPeriod}</p>
          </div>
          <div className="bg-black p-4 text-center">
            <p className="text-xs text-[#565656] uppercase tracking-widest mb-1">Encrypted</p>
            <p className={`text-sm font-bold ${trail.encrypted ? "text-[#D4D4D4]" : "text-[#A6151D]"}`}>
              {trail.encrypted ? "Yes" : "No"}
            </p>
          </div>
          <div className="bg-black p-4 text-center">
            <p className="text-xs text-[#565656] uppercase tracking-widest mb-1">Can Opt Out</p>
            <p className={`text-sm font-bold ${trail.canOptOut ? "text-[#D4D4D4]" : "text-[#A6151D]"}`}>
              {trail.canOptOut ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Iceland note */}
        {dp.icelandNote && (
          <div className="border border-[#565656] p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-[#D4D4D4] mb-3">Iceland — what this means for you</p>
            <p className="text-sm text-[#565656] leading-relaxed">{dp.icelandNote}</p>
          </div>
        )}

        {/* GDPR rights */}
        <div className="border border-[#565656] p-5 mb-8">
          <p className="text-xs uppercase tracking-widest text-[#D4D4D4] mb-4">Your rights in Iceland (GDPR)</p>
          <ul className="flex flex-col gap-2">
            {[
              "Right to access — request a copy of all data this company holds on you",
              "Right to erasure — demand deletion of your data ('right to be forgotten')",
              "Right to restriction — limit how your data is used while a dispute is open",
              "Right to portability — receive your data in a machine-readable format",
              "Right to object — opt out of processing based on legitimate interests",
              "Right to complain — file a complaint with Persónuvernd at personuvernd.is",
            ].map((right) => (
              <li key={right} className="flex items-start gap-3 text-sm text-[#565656]">
                <span className="text-[#D4D4D4] mt-0.5 shrink-0">—</span>
                {right}
              </li>
            ))}
          </ul>
        </div>

        {/* Total recipients */}
        <div className="border border-[#A6151D]/40 p-5 mb-10">
          <p className="text-sm text-[#D4D4D4] leading-relaxed">
            This single data type reaches{" "}
            <span className="font-bold text-[#A6151D]">{allRecipients.length + 1} organisations</span>{" "}
            beyond your home — including{" "}
            {allRecipients.some((n) => n.type === "government") ? "government agencies, " : ""}
            {allRecipients.some((n) => n.type === "broker") ? "data brokers, " : ""}
            {allRecipients.some((n) => n.type === "advertiser") ? "advertisers" : "and more"}.
          </p>
        </div>

        <Link
          href={`/devices/${device.slug}`}
          className="text-xs text-[#565656] hover:text-[#D4D4D4] uppercase tracking-widest transition-colors"
        >
          ← See all data {device.name} collects
        </Link>
      </div>
    </main>
  );
}
