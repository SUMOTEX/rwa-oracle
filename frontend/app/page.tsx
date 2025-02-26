import { title } from "@/components/primitives";
import OraclePage from '@/components/oracle/OracleHome';

export default function Home() {
  return (
    <section className="flex gap-4">
      <div className=" space-x-4 mb-4 mt-2">
        <OraclePage />
      </div>
    </section>
  );
}
