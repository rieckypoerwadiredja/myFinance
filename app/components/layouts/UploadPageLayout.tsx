import UploadMainArea from "../fragments/UploadMainArea";
import UploadSidebar from "../fragments/UploadSidebar";
import UploadCreateTransactions from "../fragments/UploadCreateTransactions";
import PageHeader from "../elements/PageHeader";

export default function UploadPageLayout() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <PageHeader
        title="Import Statement"
        description="Bring your financial story to life. Select your institution and upload your monthly PDF ledger for instant, AI-driven analysis."
      />
      <UploadCreateTransactions />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        <UploadMainArea />
        <UploadSidebar />
      </div>
    </div>
  );
}
