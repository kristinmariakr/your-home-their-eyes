import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevice, severityConfig, devices } from "@/lib/data";

export function generateStaticParams() {
  return devices.map((d) => ({ slug: d.slug }));
}

export default async function DevicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = getDevice(slug);
  if (!device) notFound();

  return (
    <main className="min-h-screen bg-black text-[#D4D4D4]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-xs text-[#565656] hover:text-[#D4D4D4] uppercase tracking-widest mb-10 inline-block transition-colors">
          ← All devices
        </Link>

        <div className="mb-10 border-b border-[#565656] pb-10">
          <p className="text-xs uppercase tracking-widest text-[#565656] mb-3">{device.category}</p>
          <h1 className="text-4xl font-bold text-[#D4D4D4] mb-4 leading-tight">{device.name}</h1>
          <p className="text-[#565656] leading-relaxed mb-5">{device.description}</p>
          <div className="flex flex-wrap gap-3">
            {device.alwaysOn && (
              <span className="text-xs text-[#A6151D] border border-[#A6151D]/40 px-3 py-1 uppercase tracking-widest">
                Always on
              </span>
            )}
            {device.networkRisk && (
              <span className="text-xs text-[#A6151D] border border-[#A6151D]/40 px-3 py-1 uppercase tracking-widest">
                Network entry risk
              </span>
            )}
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-[#565656] mb-4">What data does it collect?</p>
        <p className="text-sm text-[#565656] mb-8">Click any data type to trace where it goes.</p>

        <div className="flex flex-col gap-px bg-[#565656]">
          {device.dataPoints.map((dp) => {
            const sev = severityConfig[dp.severity];
            return (
              <Link
                key={dp.id}
                href={`/devices/${device.slug}/data/${dp.id}`}
                className="group bg-black p-5 hover:bg-[#0d0d0d] transition-colors duration-150"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-[#D4D4D4] group-hover:text-[#A6151D] transition-colors">
                        {dp.name}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 border uppercase tracking-widest ${sev.bg} ${sev.color} ${sev.border}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#565656]">{dp.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {dp.examples.slice(0, 2).map((ex) => (
                        <span key={ex} className="text-xs text-[#565656] border border-[#565656] px-2 py-1">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[#565656] group-hover:text-[#D4D4D4] text-xl mt-1 transition-colors shrink-0">→</span>
                </div>
                <div className="mt-4 pt-3 border-t border-[#565656] flex flex-wrap gap-4 text-xs text-[#565656]">
                  <span>Kept: {dp.trail.retentionPeriod}</span>
                  <span>{dp.trail.canOptOut ? "Can opt out" : "Cannot opt out"}</span>
                  <span>{dp.trail.encrypted ? "Encrypted" : "Not encrypted"}</span>
                  {dp.icelandNote && <span className="text-[#D4D4D4]">Iceland note</span>}
                  {dp.incidents && dp.incidents.length > 0 && (
                    <span className="text-[#A6151D]">{dp.incidents.length} known incident{dp.incidents.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
