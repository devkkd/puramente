import * as XLSX from "xlsx";

export function generateExcelFile(products) {
  try {
    const data = products.map((p) => ({
      "Product Name": p.productName || "",
      "Design Code": p.designCode || "",
      "Description": p.description || "",
      "Category": typeof p.category === "object" ? p.category?.name || "" : p.category || "",
      "Best Seller": p.bestSeller ? "TRUE" : "FALSE",
      "New Arrival": p.newArrival ? "TRUE" : "FALSE",
      "Meta Title": p.seo?.metaTitle || "",
      "Meta Description": p.seo?.metaDescription || "",
      "Meta Keywords": Array.isArray(p.seo?.metaKeywords)
        ? p.seo.metaKeywords.join(", ")
        : p.seo?.metaKeywords || "",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [20, 15, 30, 15, 12, 12, 20, 25, 20];
    worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));

    // Format header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Alternating row colors
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = {
          fill: R % 2 === 0 ? { fgColor: { rgb: "F5F5F5" } } : { fgColor: { rgb: "FFFFFF" } },
          alignment: { horizontal: "left", vertical: "center" },
          border: {
            left: { style: "thin", color: { rgb: "E0E0E0" } },
            right: { style: "thin", color: { rgb: "E0E0E0" } },
            top: { style: "thin", color: { rgb: "E0E0E0" } },
            bottom: { style: "thin", color: { rgb: "E0E0E0" } },
          },
        };
      }
    }

    // Freeze header row
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    return workbook;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    throw error;
  }
}

export function downloadExcelFile(workbook, filename) {
  try {
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    throw error;
  }
}
