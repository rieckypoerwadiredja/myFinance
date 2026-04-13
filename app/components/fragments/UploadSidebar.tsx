export default function UploadSidebar() {
  return (
    <aside className="lg:col-span-4 space-y-8">
      <section className="bg-surface-container-low p-8 rounded-xl">
        <h3 className="text-xl font-bold mb-6 text-on-surface">
          Submission Guide
        </h3>
        <ul className="space-y-6">
          {[
            {
              step: 1,
              title: "Download PDF",
              desc: 'Export your "Monthly Statement" from your bank\'s official portal.',
            },
            {
              step: 2,
              title: "Verify Details",
              desc: "Ensure the PDF is not password protected before uploading.",
            },
            {
              step: 3,
              title: "Upload & Sync",
              desc: "Drag the file into the curator area. We'll handle the rest.",
            },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="w-6 h-6 flex-shrink-0 bg-primary text-white rounded-full text-xs font-bold flex items-center justify-center">
                {item.step}
              </span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
          Specs
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
            <span className="text-sm font-medium">Format</span>
            <span className="text-sm text-primary font-bold">PDF Only</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
            <span className="text-sm font-medium">Max Size</span>
            <span className="text-sm text-on-surface">15 MB</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium">Processing Time</span>
            <span className="text-sm text-on-surface">&lt; 10 Seconds</span>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden bg-primary rounded-xl p-8 text-white">
        <div className="relative z-10">
          <h4 className="text-lg font-bold mb-2">Need Help?</h4>
          <p className="text-sm opacity-80 mb-6 leading-relaxed">
            If you having trouble exporting your bank statements, read our
            detailed guide for each bank.
          </p>
          <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-sm font-bold transition-all">
            View Help Center
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>
    </aside>
  );
}
