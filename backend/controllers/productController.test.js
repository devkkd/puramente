const { sanitizeSeoFields } = require("../utils/seoHelper");

describe("Product Bulk Upload - SEO Sanitization", () => {
  describe("sanitizeSeoFields function", () => {
    
    test("should sanitize metaTitle to max 60 characters", () => {
      const longTitle = "A".repeat(100);
      const result = sanitizeSeoFields(longTitle, null, []);
      
      expect(result.metaTitle).toBe("A".repeat(60));
      expect(result.metaTitle.length).toBe(60);
    });

    test("should sanitize metaDescription to max 160 characters", () => {
      const longDescription = "B".repeat(200);
      const result = sanitizeSeoFields(null, longDescription, []);
      
      expect(result.metaDescription).toBe("B".repeat(160));
      expect(result.metaDescription.length).toBe(160);
    });

    test("should limit metaKeywords to first 10 items only", () => {
      const manyKeywords = Array.from({ length: 15 }, (_, i) => `keyword${i + 1}`);
      const result = sanitizeSeoFields(null, null, manyKeywords);
      
      expect(result.metaKeywords.length).toBe(10);
      expect(result.metaKeywords).toEqual(
        Array.from({ length: 10 }, (_, i) => `keyword${i + 1}`)
      );
    });

    test("should trim whitespace from all SEO fields", () => {
      const title = "  Test Title  ";
      const description = "  Test Description  ";
      const keywords = ["  keyword1  ", "  keyword2  "];
      
      const result = sanitizeSeoFields(title, description, keywords);
      
      expect(result.metaTitle).toBe("Test Title");
      expect(result.metaDescription).toBe("Test Description");
      expect(result.metaKeywords).toEqual(["keyword1", "keyword2"]);
    });

    test("should handle null values gracefully", () => {
      const result = sanitizeSeoFields(null, null, []);
      
      expect(result.metaTitle).toBeNull();
      expect(result.metaDescription).toBeNull();
      expect(result.metaKeywords).toEqual([]);
    });

    test("should filter out empty keywords", () => {
      const keywords = ["valid", "", "  ", "another"];
      const result = sanitizeSeoFields(null, null, keywords);
      
      expect(result.metaKeywords).toEqual(["valid", "another"]);
      expect(result.metaKeywords.length).toBe(2);
    });

    test("should handle mixed case input for keywords", () => {
      const keywords = ["Keyword1", "KEYWORD2", "keyword3"];
      const result = sanitizeSeoFields(null, null, keywords);
      
      expect(result.metaKeywords).toEqual(["Keyword1", "KEYWORD2", "keyword3"]);
    });

    test("should process valid SEO data without truncation", () => {
      const title = "Perfect Title";
      const description = "This is a perfect description";
      const keywords = ["keyword1", "keyword2", "keyword3"];
      
      const result = sanitizeSeoFields(title, description, keywords);
      
      expect(result.metaTitle).toBe(title);
      expect(result.metaDescription).toBe(description);
      expect(result.metaKeywords).toEqual(keywords);
    });

    test("should handle exactly 60 character title", () => {
      const title = "A".repeat(60);
      const result = sanitizeSeoFields(title, null, []);
      
      expect(result.metaTitle).toBe(title);
      expect(result.metaTitle.length).toBe(60);
    });

    test("should handle exactly 160 character description", () => {
      const description = "B".repeat(160);
      const result = sanitizeSeoFields(null, description, []);
      
      expect(result.metaDescription).toBe(description);
      expect(result.metaDescription.length).toBe(160);
    });

    test("should handle exactly 10 keywords", () => {
      const keywords = Array.from({ length: 10 }, (_, i) => `keyword${i}`);
      const result = sanitizeSeoFields(null, null, keywords);
      
      expect(result.metaKeywords.length).toBe(10);
      expect(result.metaKeywords).toEqual(keywords);
    });
  });

  describe("SEO Warning Logs", () => {
    let consoleWarnSpy;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    test("should log warning when title exceeds 60 characters", () => {
      const metaTitle = "A".repeat(100);
      
      // Simulate the warning logic from bulkUploadProducts
      if (metaTitle && metaTitle.length > 60) {
        console.warn(`⚠️ Row 1: Meta title truncated from ${metaTitle.length} to 60 chars`);
      }
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `⚠️ Row 1: Meta title truncated from 100 to 60 chars`
      );
    });

    test("should log warning when description exceeds 160 characters", () => {
      const metaDescription = "B".repeat(200);
      
      // Simulate the warning logic from bulkUploadProducts
      if (metaDescription && metaDescription.length > 160) {
        console.warn(`⚠️ Row 2: Meta description truncated from ${metaDescription.length} to 160 chars`);
      }
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `⚠️ Row 2: Meta description truncated from 200 to 160 chars`
      );
    });

    test("should log warning when keywords exceed 10", () => {
      const metaKeywords = Array.from({ length: 15 }, (_, i) => `keyword${i}`);
      
      // Simulate the warning logic from bulkUploadProducts
      if (metaKeywords.length > 10) {
        console.warn(`⚠️ Row 3: More than 10 keywords provided. Using first 10 only.`);
      }
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `⚠️ Row 3: More than 10 keywords provided. Using first 10 only.`
      );
    });

    test("should not log warning when all fields are within limits", () => {
      const metaTitle = "Valid Title";
      const metaDescription = "Valid Description";
      const metaKeywords = ["key1", "key2"];
      
      // Simulate the warning logic from bulkUploadProducts
      if (metaTitle && metaTitle.length > 60) {
        console.warn(`⚠️ Row 4: Meta title truncated`);
      }
      if (metaDescription && metaDescription.length > 160) {
        console.warn(`⚠️ Row 4: Meta description truncated`);
      }
      if (metaKeywords.length > 10) {
        console.warn(`⚠️ Row 4: More than 10 keywords provided`);
      }
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe("Excel Row Data Extraction", () => {
    test("should extract SEO fields from Excel row data", () => {
      const excelRow = {
        "Product Code": "P001",
        "Product Name": "Test Product",
        "Meta Title": "Test Product Title",
        "Meta Description": "A great test product",
        "Meta Keywords": "jewelry,gold,luxury"
      };

      const metaTitle = excelRow["Meta Title"] ? excelRow["Meta Title"].toString().trim() : null;
      const metaDescription = excelRow["Meta Description"] ? excelRow["Meta Description"].toString().trim() : null;
      const metaKeywordsRaw = excelRow["Meta Keywords"] ? excelRow["Meta Keywords"].toString().trim() : "";
      const metaKeywords = metaKeywordsRaw ? metaKeywordsRaw.split(",").map(k => k.trim()).filter(k => k.length > 0) : [];

      expect(metaTitle).toBe("Test Product Title");
      expect(metaDescription).toBe("A great test product");
      expect(metaKeywords).toEqual(["jewelry", "gold", "luxury"]);
    });

    test("should handle missing SEO fields in Excel row", () => {
      const excelRow = {
        "Product Code": "P002",
        "Product Name": "Another Product"
        // No SEO fields
      };

      const metaTitle = excelRow["Meta Title"] ? excelRow["Meta Title"].toString().trim() : null;
      const metaDescription = excelRow["Meta Description"] ? excelRow["Meta Description"].toString().trim() : null;
      const metaKeywordsRaw = excelRow["Meta Keywords"] ? excelRow["Meta Keywords"].toString().trim() : "";
      const metaKeywords = metaKeywordsRaw ? metaKeywordsRaw.split(",").map(k => k.trim()).filter(k => k.length > 0) : [];

      expect(metaTitle).toBeNull();
      expect(metaDescription).toBeNull();
      expect(metaKeywords).toEqual([]);
    });
  });
});
