import Content from "./content/content";
import Sidebar from "./sidebar/sidebar";

export default function HomePage() {
    return (
        <>
            <div className="w-100 row px-3 m-0">
                <div className="col-lg-3 col-md-12 border-end">
                    <Sidebar />
                </div>
                <div className="col-lg-9 col-md-12">
                    <Content />
                </div>
            </div>
        </>
    );
}
