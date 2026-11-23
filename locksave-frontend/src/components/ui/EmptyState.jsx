export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-cream-300 px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 grid size-14 place-items-center rounded-full bg-fir-50 text-fir-700">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <h2 className="text-xl">{title}</h2>
      {text && <p className="mt-2 max-w-sm text-muted">{text}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}