import { title } from "@/components/primitives";
import OraclePage from '@/components/Oracle';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <h1 className={`${title()} text-center`}>SUMOTEX Oracle</h1>
      <div className="flex flex-row items-center justify-center space-x-4 mb-4 mt-2">
        <OraclePage />
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">

      </div>
    </section>
  );
}
