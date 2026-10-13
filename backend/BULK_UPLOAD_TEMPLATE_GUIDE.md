# Bulk Upload Excel Template - SEO Feature

This template is for bulk uploading products with SEO metadata (Meta Title, Meta Description, Meta Keywords) and schema auto-generation.

## Column Descriptions:

**Required Columns:**
- **Product Code** (string, unique): Unique identifier for the product (e.g., NK-101, BR-205)
- **Product Name** (string): Name of the product
- **Category** (string): Must match exactly with a category in the database (case-insensitive matching)
- **Sub - Category** (string): One of:
  - "with gemstone" → Sets option to "with gem"
  - "without gemstone" → Sets option to "without gem"
  - Any value containing "gem" → Interpreted as "with gem" (with warning)
  - Empty or "no gem" → Sets option to "without gem"
  
**Optional Columns:**
- **Description** (string): Product description
- **Image Name** (string): Name of image file (e.g., NK-101.jpg) - must match uploaded file
- **Image URL** (string): Direct URL to image (http/https) - if provided, used instead of Image Name
- **New Arrival** (yes/no/true/false): Mark as new arrival
- **Best Seller** (yes/no/true/false): Mark as best seller
- **Meta Title** (string, max 60 chars): SEO page title
- **Meta Description** (string, max 160 chars): SEO page description
- **Meta Keyword 1, Meta Keyword 2, Meta Keyword 3, ... (string)**: SEO keywords (max 10 total)

## Notes:

1. **Sub - Category Validation**: 
   - The backend now validates the Sub - Category value with flexible matching
   - If your value doesn't match exactly, you'll see a warning in the backend logs
   - Always try to use "with gemstone" or "without gemstone" for consistency

2. **Image Handling**: 
   - If Image URL is provided (http/https), it's used directly
   - Otherwise, the system matches by Image Name or Product Code filename
   - Make sure image file is uploaded along with the Excel file

3. **SEO Fields**:
   - If any SEO field is provided, a JSON-LD schema is auto-generated
   - Meta Title and Description are auto-sanitized (truncated if too long)
   - Keywords are limited to 10 entries

4. **Processing**:
   - The backend processes in the background after accepting the upload
   - Monitor the backend terminal for progress logs
   - Refresh the Products table in 5-10 minutes to see new items

## Example Row:
\\\
Product Code: NK-101
Product Name: Classic Pearl Necklace
Category: Necklaces
Sub - Category: with gemstone
Description: Handcrafted pearl necklace with gemstone accents
Image Name: NK-101.jpg
New Arrival: yes
Best Seller: no
Meta Title: Classic Pearl Necklace - Handcrafted Design
Meta Description: Discover our exquisite handcrafted pearl necklaces with authentic gemstones.
Meta Keyword 1: pearl necklace
Meta Keyword 2: jewelry
Meta Keyword 3: luxury
\\\

## Template Excel File Format:

| Product Code | Product Name | Category | Sub - Category | Description | Image Name | New Arrival | Best Seller | Meta Title | Meta Description | Meta Keyword 1 | Meta Keyword 2 | Meta Keyword 3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| NK-101 | Classic Pearl Necklace | Necklaces | with gemstone | Handcrafted pearl... | NK-101.jpg | yes | no | Classic Pearl Necklace | Discover our exquisite... | pearl necklace | jewelry | luxury |
| BR-205 | Silver Bracelet | Bracelets | without gemstone | Pure silver bracelet | BR-205.jpg | yes | no | Silver Bracelet | Premium silver bracelet... | silver | bracelet | jewelry |
| RG-310 | Gold Ring | Rings | with gemstone | Gold ring with ruby | RG-310.jpg | no | yes | Gold Ring with Ruby | Elegant gold ring... | gold ring | ruby | gemstone |

