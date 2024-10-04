'use client';
import React, { useState } from "react";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { SearchIcon, ChevronDownIcon } from "@/components/icons";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function SearchBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            toggleDrawer();
        }
    };

    const searchInput = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: "bg-white p-4",
                input: "text-md",
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                </Kbd>
            }
            labelPlacement="outside"
            placeholder="Search by fund name or keywords..."
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
        />
    );

    const filterButtons = (
        <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-4">
            {/* Similar Dropdown components here */}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start lg:space-x-4">
            <Button className="bg-white p-4 lg:hidden" onClick={toggleDrawer}>
                Filters <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                    onClick={toggleDrawer}
                    role="button"
                    tabIndex={0}
                    onKeyPress={handleKeyPress}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-3/4 bg-white p-6 z-20"
                        onClick={(e) => e.stopPropagation()}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && e.stopPropagation()}
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex-shrink-0">
                                {searchInput}
                            </div>
                            {filterButtons}
                            <Button className="bg-[#60B7A3] text-white" size="md">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="hidden lg:flex lg:space-x-4">
                <div className="flex-shrink-0">
                    {searchInput}
                </div>
                {filterButtons}
            </div>
        </div>
    );
}
