import RightSidebarContent from "./RightSidebarContent";

const RightSidebar = () => {
    return (
        <aside className="sidebar flex-column invisible-scroll !hidden !justify-start border-l border-divider md:!hidden 3xl:!flex  3xl:w-[400px]">
            <RightSidebarContent />
        </aside>
    );
};

export default RightSidebar;
