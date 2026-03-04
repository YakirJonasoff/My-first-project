export default function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-[#1e2740]" />
      <span className="text-xs font-medium text-slate-500 uppercase tracking-widest px-2">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#1e2740]" />
    </div>
  )
}
