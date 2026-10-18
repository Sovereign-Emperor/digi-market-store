// This component visualizes progress as a bar. It is used for lessons and reading progress so the
// user can see completion percentage without reading raw numeric values alone.
export default function ProgressBar({ value = 0, label }) { return <div className="progress-wrap"><div className="progress-label"><span>{label}</span><b>{value}%</b></div><div className="progress"><i style={{ width: `${value}%` }} /></div></div>; }
