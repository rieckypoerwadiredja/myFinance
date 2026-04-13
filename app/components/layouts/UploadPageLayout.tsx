import UploadHeader from "../fragments/UploadHeader";
import UploadCreateTransactions from "../fragments/UploadCreateTransactions";
import UploadMainArea from "../fragments/UploadMainArea";
import UploadSidebar from "../fragments/UploadSidebar";

export default function UploadPageLayout() {
  return (
    <div className="space-y-12">
      <UploadHeader />
      <UploadCreateTransactions />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <UploadMainArea />
        <UploadSidebar />
      </div>
    </div>
  );
}
