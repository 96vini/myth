import { TabsTrigger } from "@radix-ui/react-tabs";

export default function AppTabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  return (
    <TabsTrigger value={value} className="flex justify-center items-center rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:shadow-md">
      {children}
    </TabsTrigger>
  )
}