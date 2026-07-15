import ProviderGalleryCard from "./ProviderGalleryCard";
import ProviderDocumentsCard from "./ProviderDocumentsCard";
import ProviderServicesCard from "./ProviderServicesCard";
import ProviderPackageCard from "./ProviderPackageCard";
import type { ProviderDocumentInfo, ProviderPackageInfo, ProviderServiceInfo } from "../../types/entities";

interface ProviderDetailsGridProps {
  galleryCount: number;
  documents: ProviderDocumentInfo[];
  services: ProviderServiceInfo[];
  currentPackage: ProviderPackageInfo;
}

export default function ProviderDetailsGrid({ galleryCount, documents, services, currentPackage }: ProviderDetailsGridProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <ProviderGalleryCard count={galleryCount} />
      <ProviderDocumentsCard documents={documents} />
      <ProviderServicesCard services={services} />
      <ProviderPackageCard pkg={currentPackage} />
    </div>
  );
}
