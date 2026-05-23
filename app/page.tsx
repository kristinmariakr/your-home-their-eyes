import Link from "next/link";
import Image from "next/image";
import { devices, severityConfig } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-[#D4D4D4]">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14 border-b border-[#565656] pb-12 text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={127}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#D4D4D4] mb-4 leading-tight uppercase tracking-[0.1em] sm:tracking-[0.2em]" style={{ fontFamily: "var(--font-barlow)" }}>
            Your Home,{" "}
            <span className="text-[#A6151D]">Their Eyes</span>
          </h1>
          <p className="text-xl text-[#565656] leading-relaxed mb-4 uppercase tracking-widest">
            Our lives through the eyes of our devices.
          </p>
          <p className="text-xs uppercase tracking-widest text-[#565656]">Data Surveillance Project</p>
        </div>

        {/* Iceland context */}
        <div className="mb-12 border border-[#565656] p-6">
          <p className="text-sm uppercase tracking-widest font-bold text-black bg-[#A6151D] px-3 py-1 mb-6 inline-block">Iceland & Data Privacy</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[#D4D4D4] font-bold mb-2 text-sm uppercase tracking-wide">You have GDPR rights</p>
              <p className="text-sm text-[#565656] leading-relaxed">
                Iceland is an EEA member, so GDPR applies. Unlike users in the US, you have the legal right to access, correct, and delete your data from any of these companies — even though the data is stored on American servers.
              </p>
            </div>
            <div>
              <p className="text-[#D4D4D4] font-bold mb-2 text-sm uppercase tracking-wide">The kennitala risk</p>
              <p className="text-sm text-[#565656] leading-relaxed">
                Iceland's national ID (kennitala) is used across almost every service — banks, healthcare, employers, shops. Smart device accounts linked to your identity can be cross-referenced with an unusually complete picture of who you are.
              </p>
            </div>
            <div>
              <p className="text-[#D4D4D4] font-bold mb-2 text-sm uppercase tracking-wide">Adoption is growing</p>
              <p className="text-sm text-[#565656] leading-relaxed">
                4.2% of Icelandic households had smart appliances in 2024, rising to 6.5% by 2029. With 99% internet penetration, Iceland is one of the most exposed populations to smart home data collection.
              </p>
            </div>
          </div>
        </div>

        {/* Device grid */}
        <p className="text-xs uppercase tracking-widest text-[#565656] mb-2">Select a device</p>
        <p className="text-xs text-[#565656] mb-6">Tap any device to trace where your data goes →</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#565656]">
          {devices.map((device) => {
            const maxSeverity = device.dataPoints.reduce<"low" | "medium" | "high" | "critical">((max, dp) => {
              const order = { low: 0, medium: 1, high: 2, critical: 3 };
              return order[dp.severity] > order[max] ? dp.severity : max;
            }, "low");
            const sev = severityConfig[maxSeverity];

            return (
              <Link
                key={device.slug}
                href={`/devices/${device.slug}`}
                className="group bg-black p-6 hover:bg-[#0d0d0d] border border-transparent hover:border-[#A6151D]/50 transition-all duration-150"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex flex-col gap-1">
                    {device.alwaysOn && (
                      <span className="text-xs text-[#A6151D] uppercase tracking-widest">Always on</span>
                    )}
                    {device.networkRisk && (
                      <span className="text-xs text-[#A6151D] uppercase tracking-widest">Network risk</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 border ${sev.bg} ${sev.color} ${sev.border} uppercase tracking-widest`}>
                    {sev.label}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#D4D4D4] mb-1 group-hover:text-[#A6151D] transition-colors leading-snug">
                  {device.name}
                </h2>
                <p className="text-xs text-[#565656] mb-4 uppercase tracking-widest">{device.category}</p>
                <p className="text-sm text-[#565656] leading-relaxed font-medium">{device.description}</p>
                <div className="mt-5 pt-4 border-t border-[#565656] flex items-center justify-between text-xs">
                  <span className="text-[#565656]">{device.dataPoints.length} data types tracked</span>
                  <span className="text-[#A6151D] uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-150">Explore →</span>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="mt-16 pt-6 border-t border-[#565656] text-xs text-[#565656]">
          Data sourced from privacy policies, academic research, and investigative journalism. For educational purposes.
        </footer>
      </div>
    </main>
  );
}
