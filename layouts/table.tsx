interface ThProps {
  children: React.ReactNode
}
export function Th({ children }: ThProps) {
  return (
    <th className="font-medium text-slate-400 text-left sticky z-10 top-0 bg-white">
      <div className="border-b pl-8  p-4">{children}</div>
    </th>
  )
}

interface TdProps {
  children: React.ReactNode
}
export function Td({ children }: TdProps) {
  return (
    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
      {children}
    </td>
  )
}
