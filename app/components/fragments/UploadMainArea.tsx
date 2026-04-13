import { ShieldCheck, Sparkles, Upload as UploadIcon } from "lucide-react";
import { Select } from "../elements/Select";
import { Button } from "../elements/Button";

export default function UploadMainArea() {
  return (
    <div className="lg:col-span-8 flex flex-col gap-8">
      <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-editorial border border-outline-variant/15">
        <div className="flex flex-col gap-8">
          <div className="max-w-xs">
            <Select
              label="Select Institution"
              options={[
                { value: "bca", label: "BCA (Bank Central Asia)" },
                { value: "mandiri", label: "Bank Mandiri" },
                { value: "bni", label: "BNI (Bank Negara Indonesia)" },
                { value: "bri", label: "BRI (Bank Rakyat Indonesia)" },
              ]}
              className="px-5 py-4 text-base rounded-xl border-0"
            />
          </div>

          <div className="relative group">
            <div className="w-full aspect-[16/9] bg-surface-container-low rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 group-hover:border-primary/50 transition-colors duration-300">
              <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
                <UploadIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-1">
                Drag and drop your PDF
              </h3>
              <p className="text-on-surface-variant mb-6">
                or click to browse from your computer
              </p>
              <Button
                variant="secondary"
                className="bg-white text-primary border border-primary/20 shadow-sm hover:bg-primary hover:text-white"
              >
                Select File
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-on-surface-variant">
                Ready for analysis
              </span>
              <span className="text-on-surface-variant">0%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="w-0 h-full bg-gradient-to-r from-primary to-primary-dim rounded-full transition-all duration-1000"></div>
            </div>
            <p className="text-xs text-on-surface-variant italic">
              Encryption active. Your financial data is securely processed
              locally.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl">
          <ShieldCheck className="text-primary mb-4" size={24} />
          <h4 className="text-lg font-bold mb-2">Secure & Private</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We use bank-grade 256-bit encryption. Your statements are analyzed
            for insights and never shared with third parties.
          </p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl">
          <Sparkles className="text-primary mb-4" size={24} />
          <h4 className="text-lg font-bold mb-2">Instant Categorization</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Our AI automatically detects merchants, categories, and recurring
            subscriptions from your PDF metadata.
          </p>
        </div>
      </div>
    </div>
  );
}
