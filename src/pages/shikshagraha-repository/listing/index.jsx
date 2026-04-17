import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Filters from "./Filters.jsx";
import BrowseResources from "./BrowseResources.jsx";
import Pagination from "./Pagination.jsx";
import Footer from "../common/Footer.jsx";
import MitraAiAssistantAside from "./MitraAiAssistantAside.jsx";
import { useRepositoryStore } from "../repository-hooks/useRepositoryStore.js";
import { GrResources } from "react-icons/gr";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme";

const isIOSDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export default function RepositoryPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [isMitraPopupOpen, setIsMitraPopupOpen] = useState(false);
  const { loadingList, loadingDetail, loadingMaster } = useRepositoryStore();

  const { t } = useTranslation()
  // Add filter and search logic if needed
  const isLoading = loadingList || loadingDetail || loadingMaster;

  const mediaList = useRepositoryStore((state) => state.mediaList);
  const q = useRepositoryStore((state) => state.q);

  const mediaCount = useRepositoryStore((state) => state.mediaCount);
  const pagination = useRepositoryStore((state) => state.pagination);
  const setPagination = useRepositoryStore((state) => state.setPagination);
  const itemsPerPage = pagination.limit;

  // Scroll to Browse Resources section when search completes
  React.useEffect(() => {
    if (!!mediaList?.length && q && !loadingList) {
      const browseSection = document.querySelector('[data-browse-resources]');
      if (browseSection) {
        browseSection.scrollIntoView({
          behavior: isIOSDevice() ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  }, [mediaList, q, loadingList]);

  return (
    <div className="bg-[var(--listing-white)] relative listing-pages" style={theme.vars}>
      <div className="container max-w-[1500px] h-full mx-auto">
        <div className="min-h-screen  py-3 flex flex-col  align-items-center gap-4 ">
          <Header />
          <Filters />
          <main className=" w-full mx-auto">
            {!!mediaList?.length && (
              <BrowseResources
                resources={mediaList}
                viewMode={viewMode}
                setViewMode={setViewMode}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            )}
         
           
            {!isLoading && !!!mediaList?.length && (
              <div className="w-full pt-10 mx-auto flex flex-col items-center justify-center">
                <div className="text-muted">
                  <GrResources size={100} />
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <h2 className="text-lg py-2 text-center">{t("noResourceFoundTitle")}</h2>
                </div>
              </div>
            )}
               
               <div className="w-full mt-6 mx-auto">
                <Pagination
                  resourcesPerPage={itemsPerPage}
                  totalResources={mediaCount}
                  selectedPage={Math.floor(pagination.offset / itemsPerPage)}
                  paginate={(page) => {
                    setPagination({
                      ...pagination,
                      offset: (itemsPerPage + (page - 1) * itemsPerPage) || 0,
                      limit: itemsPerPage,
                    });
                  }}
                />
              </div>
          </main>
        </div>
      </div>
      {isLoading && !mediaList?.length && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white h-screen">
          Please wait we are loading your data
        </div>
      )}

      {/* Floating Action Button */}
      <MitraAiAssistantAside />

      <Footer />
    </div>
  );
}
