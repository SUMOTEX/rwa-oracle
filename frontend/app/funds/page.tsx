import { title } from "@/components/primitives";

import SearchBar from "@/components/SearchBar";

export default function FundsPage() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
            <h1 className={`${title()} text-center`}>Our Tokenized Funds</h1>
            <p className="mb-4 text-center">Tokenised $26mil USD worth of Real World Asset</p>
            <div className="flex flex-row items-center justify-center space-x-4 mb-4 mt-2">
                <SearchBar />
            </div>
          {/* <FundList/> */}
        </section>
    );
}
