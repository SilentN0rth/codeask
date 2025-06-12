"use client";

import JobSearchSection from "@/components/ui/sidebar/JobSearchSection";
import { TagItem } from "@/components/ui/tags/TagItem";
import { questions } from "@/constants/Questions";
import { FILTER_TAGS } from "@/constants/SearchAndFilters";
import { Accordion, AccordionItem } from "@heroui/react";

import React from "react";
import DesktopMenuNewestQuestions from "../Navbar/DesktopMenuNewestQuestions";
import MobileMenuNewestQuestions from "../Navbar/MobileMenuNewestQuestions";
import MobileNavButtonLinks from "../Navbar/MobileNavButtonLinks";

const RightSidebarContent = () => {
    const accordionItemClasses = {
        base: "w-full data-[open=true]:bg-cCta-500/10 border  data-[open=true]:border-cCta-500 border-transparent rounded-lg mb-2",
        title: "font-medium text-base transition-colors",
        trigger:
            "px-5 py-0 bg-default-50 data-[open=true]:!rounded-b-none data-[hover=true]:bg-cCta-500 data-[open=true]:bg-cCta-500 rounded-lg h-14 flex items-center transition-all",
        indicator: "text-medium text-white ",
        content: "text-small px-5 py-5 text-sm",
    };

    return (
        <>
            {/* Mobile Nav Button-Links */}
            <MobileNavButtonLinks />
            <Accordion
                className="!mx-0 !px-0"
                itemClasses={accordionItemClasses}
                selectionMode="multiple"
                showDivider={false}>
                <AccordionItem title="Najnowsze pytania" key="questions" aria-label="Najnowsze pytania">
                    <DesktopMenuNewestQuestions questions={questions} />
                    <MobileMenuNewestQuestions questions={questions} />
                </AccordionItem>

                <AccordionItem title="Popularne tagi" key="tags" aria-label="Popularne tagi">
                    <div className="flex flex-wrap gap-2">
                        {FILTER_TAGS.slice(0, 10).map(({ name }) => (
                            <TagItem label={name} key={name} href={`/tags/${name}`} />
                        ))}
                    </div>
                </AccordionItem>
            </Accordion>
            <JobSearchSection />
        </>
    );
};

export default RightSidebarContent;
