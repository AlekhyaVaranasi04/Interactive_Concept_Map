import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function ExportButtons() {
  const exportImage = () => {
    const node = document.querySelector(".react-flow__viewport");
    toPng(node).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "mindmap.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const exportPDF = () => {
    const node = document.querySelector(".react-flow__viewport");
    toPng(node).then((dataUrl) => {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 10, 10, 180, 160);
      pdf.save("mindmap.pdf");
    });
  };

  return (
    <div className="flex gap-4">
      <button onClick={exportImage} className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-3 py-2 rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md font-medium border border-sky-300">
        Export PNG
      </button>
      <button onClick={exportPDF} className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all shadow-md font-medium border border-sky-400">
        Export PDF
      </button>
    </div>
  );
}

export default ExportButtons;