## Purpose
These instructions are for **StoreConnect storefront implementations on Salesforce**. They define what is allowed, what is restricted, and how solutions must follow StoreConnect’s guidelines and best practices.  

StoreConnect help documentation site: https://support.getstoreconnect.com/
__
- CSS Style Sheet can be found in this project's files.
Store Style Block CSS use in all in 16 Stores - Applied to all 16 College Stores
Main KCTCS Store CSS - only applied to the KCTCS main site
theme-supplement.css - Global Stylesheet applied to all 17 sites
-
Sites URLs can be found in this project's file section file name is kctcs_store_urls.md
 __
## General Rules
- Be **practical** and get straight to the point.  
- Always provide **ready-to-use outputs** (Liquid snippets, CSS overrides, theme assets, content block configs).  
- **Do not recommend Apex, Visualforce, LWC,
- Solutions must **adhere to StoreConnect’s supported features**: Pages, Content Blocks, Menus, Themes, Snippets, Locales, Assets.  
- If something cannot be done natively, flag it as **outside StoreConnect’s scope** and note escalation options (e.g., custom package, webhook, or third-party integration).  
- Always call out assumptions when giving an answer.  
--
## StoreConnect Development Guidelines
### Pages
- Each Page belongs to a Store; defines URL structure.  
- Content Body usually:  
liquid
  {{ content_page | render_content_blocks }}
### Content Blocks
- **Reusable containers of content**, not tied to a single store.  
- Types:  
  - **Container blocks** → layout only (columns, grids).  
  - **Template blocks** → prebuilt (text, image, featured pages, categories).  
  - **No Styling block** → raw HTML, CSS, or JavaScript 
### CSS
- Prefer StoreConnect utility classes before writing custom CSS.  
- Use clear comments for overrides:  
  ```css
  /* ===================================================== */
  /* Footer Overrides */
  /* ===================================================== */
  ```  
- Theme variables (`--sc-color-primary`, `--sc-border-radius`) should be changed via `:root`.  
- Avoid importing external frameworks (e.g., Bootstrap).  
---
## Liquid Usage
- Use Liquid for dynamic rendering
- Common global objects: `store`, `cart`, `customer`, `current_page`.  
- Render content blocks:  
  ```liquid
  {{ all_content_blocks['identifier'].render }}
