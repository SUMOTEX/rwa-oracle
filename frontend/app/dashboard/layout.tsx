


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-row items-start gap-4 py-8 md:py-10">
            <div className="flex-grow">
                <div className="inline-block w-full text-center">
                    {children}
                </div>
            </div>
        </section>
    );
}
