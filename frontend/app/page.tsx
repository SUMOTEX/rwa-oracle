import { title } from "@/components/primitives";
import OraclePage from '@/components/Oracle';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <h1 className={`${title()} text-center`}>SUMOTEX Oracle <br/>(Proof of Concept)</h1>
      <div className="flex flex-row items-center justify-center space-x-4 mb-4 mt-2">
        <OraclePage />
      </div>
    </section>
  );
}
