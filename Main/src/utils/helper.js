import { API_BASE_URL } from "api/client.js";
import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";
export const toApiAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
export async function compressAnyFile(file) {
  try {
    // 🖼 IMAGE COMPRESSION
    if (file.type.startsWith("image/")) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });

      return new File([compressed], file.name, {
        type: compressed.type,
      });
    }

    // 📄 PDF COMPRESSION (basic)
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      return new File([compressedBytes], file.name, {
        type: "application/pdf",
      });
    }

    // 📁 OTHER FILES → no compression
    return file;
  } catch (err) {
    console.error("Compression failed:", err);

    // fallback (VERY IMPORTANT)
    return file;
  }
}
